import { Injectable } from '@nestjs/common'

import { ITask, IFunding, ITaskAndFunding, IApplication, IAuthenticationData, IBountyReceiver, ILedgerEntry } from './interfaces'
import { LoggerService } from './logger/logger.service'
import { GithubIntegrationService } from './github-integration/github-integration.service'
import { ELogLevel } from './logger/logger-interface'
import { AuthenticationService } from './authentication/authentication.service'
import { PersistencyService } from './persistency/persistency.service'
import { LedgerEntriesService } from './postgres/ledger-entries/ledger-entries.service'
import { config } from './gitcoin-enterprise-server'
const shelljs = require('shelljs')

@Injectable()
export class AppService {

  // Interface would be cool for PersistencyService... The reason why I could not use interface polymorphism here is interfaces are design-time only in the current context :)
  public constructor(private readonly lg: LoggerService,
                     private readonly gitHubIntegration: GithubIntegrationService,
                     private readonly authenticationService: AuthenticationService,
                     private readonly persistencyService: PersistencyService) {

  }

  public triggerBackup(): void {
    const pathToBackupScript = `${__dirname}/../trigger-operational-data-backup.sh`
    void this.lg.log(ELogLevel.Info, `triggering backup via script: ${pathToBackupScript}`)
    // shelljs.exec(pathToBackupScript)
  }

  public async getAuthenticationData(michaelsfriendskey: string): Promise<IAuthenticationData> {
    return this.authenticationService.getAuthenticationDataFromMemory(michaelsfriendskey)
  }

  public async postSolutionApproach(application: IApplication, userAccessToken: string): Promise<void> {
    const authenticationData = this.authenticationService.getAuthenticationDataFromMemory(userAccessToken)
    if (authenticationData === undefined) {
      throw new Error('Authentication data not found for this token')
    }
    await this.gitHubIntegration.postCommentAboutApplication(application)
  }

  public getGitHubToken(): string {
    return config.gitHubTokenForPostingCommentsAndForGettingIssueData
  }

  public async saveFundedTasks(fundedTasks: ITask[]): Promise<void> {
    await  this.persistencyService.saveFundedTasks(fundedTasks)
  }

  public authorizeInstallation(): void {
    const userId = '123'
    void this.lg.log(ELogLevel.Info, `User: ${userId} authorized installation.`)
  }

  public async getFundedTasks(): Promise<ITask[]> {
    return this.persistencyService.getFundedTasks()
  }

  public async getPotentialReceivers(): Promise<string[]> {
    const authenticationData = await this.persistencyService.getAuthenticationData()
    const potentialReceivers: string[] = []
    for (const entry of authenticationData) {
      potentialReceivers.push(entry.login)
    }

    void this.lg.log(ELogLevel.Debug, `I found ${potentialReceivers.length} receivers`)

    return potentialReceivers
  }

  public async getLedgerEntries(): Promise<ILedgerEntry[]> {
    return this.persistencyService.getLedgerEntries()
  }

  public async saveFunding(taskAndFunding: ITaskAndFunding, userAccessToken: string): Promise<ILedgerEntry> {

    const authenticationData = this.authenticationService.getAuthenticationDataFromMemory(userAccessToken)
    if (authenticationData === undefined) {
      throw new Error(`I could not find authentication Data for this token: ${userAccessToken}`)
    }

    const newLedgerEntry: ILedgerEntry = await this.createLedgerEntryFromFunding(taskAndFunding.funding)

    const tasks = await this.persistencyService.getFundedTasks()
    const existingTask = tasks.filter((entry: ITask) => entry.link === taskAndFunding.task.link)[0]

    console.log(`saving funding: ${JSON.stringify(taskAndFunding.funding)}`)
    console.log(`for task: ${JSON.stringify(taskAndFunding.task)}`)
    let task: ITask
    if (existingTask === undefined) {
      task = taskAndFunding.task
    } else {
      task = existingTask
      task.funding = task.funding + taskAndFunding.funding.amount
      const indexOfExistingTasks = tasks.indexOf(existingTask)
      tasks.splice(indexOfExistingTasks, 1)
    }

    tasks.push(task)
    console.log(`saving it `)
    await this.persistencyService.saveFundedTasks(tasks)

    await this.gitHubIntegration.postCommentAboutSuccessfullFunding(taskAndFunding.task.link, taskAndFunding.funding)
    void this.lg.log(ELogLevel.Notification, `I received a funding of ${taskAndFunding.funding.amount} EIC for the following task: ${task.link}`)

    return newLedgerEntry

  }

  public async postTransfer(receivers: IBountyReceiver[], userAccessToken: string): Promise<ILedgerEntry[]> {

    const authenticationData = this.authenticationService.getAuthenticationDataFromMemory(userAccessToken)
    if (authenticationData === undefined) {
      throw new Error(`I could not find authentication Data for this token: ${userAccessToken}`)
    }

    const newLedgerEntries: ILedgerEntry[] = await this.createLedgerEntriesFromBountyPayment(receivers)
    void this.lg.log(ELogLevel.Info, `I created the following ledger entries: ${JSON.stringify(newLedgerEntries)} `)

    // this.gitHubIntegration.postCommentAboutSuccessfullTransfer(taskAndFunding.task.link, taskAndFunding.funding)
    // this.lg.log(ELogLevel.Notification, `I received a funding of ${taskAndFunding.funding.amount} EIC for the following task: ${task.link}`)
    return newLedgerEntries

  }

  private async createLedgerEntryFromFunding(funding: IFunding): Promise<ILedgerEntry> {
    const entries: ILedgerEntry[] = await this.persistencyService.getLedgerEntries()
    let entry: ILedgerEntry
    entry = {
      id: `tr-${Date.now().toString()}`,
      date: new Date().toISOString(),
      amount: funding.amount,
      sender: funding.funderId,
      receiver: funding.taskLink,
    }

    entries.push(entry)

    await  this.persistencyService.saveLedgerEntries(entries)

    return entry
  }

  private async createLedgerEntriesFromBountyPayment(receivers: IBountyReceiver[]): Promise<ILedgerEntry[]> {
    let entry: ILedgerEntry
    const newEntries: ILedgerEntry[] = []
    for (const receiver of receivers) {
      entry = {
        id: `tr-${Date.now().toString()}`,
        date: new Date().toISOString(),
        amount: Number(receiver.amount),
        sender: receiver.bountyForTaskLink,
        receiver: receiver.login,
      }
      newEntries.push(entry)
    }

    const entries: ILedgerEntry[] = await this.persistencyService.getLedgerEntries()
    entries.push(entry)
    await this.persistencyService.saveLedgerEntries(entries)

    return newEntries
  }

}
