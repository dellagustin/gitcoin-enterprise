import { Injectable } from '@nestjs/common'

import { ITask, IFunding, ITaskAndFunding, IApplication, IAuthenticationData, IBountyReceiver } from './interfaces'
import { LoggerService } from './logger/logger.service'
import { LedgerConnector } from './ledger-connector/ledger-connector-file-system.service'
import { GithubIntegrationService } from './github-integration/github-integration.service'
import { ILedgerEntry } from './ledger-connector/ledger-connector.interface'
import { ELogLevel } from './logger/logger-interface'
import { AuthenticationService } from './authentication/authentication.service'
import { config } from './app.module'
import { PersistencyService } from './persistency/persistency.service'
const shelljs = require('shelljs')

@Injectable()
export class AppService {

  // Interface would be cool for LedgerConnector... The reason why I could not use interface polymorphism here is interfaces are design-time only in the current context :)
  public constructor(private readonly lg: LoggerService, private readonly ledgerConnector: LedgerConnector, private readonly gitHubIntegration: GithubIntegrationService, private readonly authenticationService: AuthenticationService, private readonly persistencyService: PersistencyService) {
  }

  public triggerBackup(): void {
    const pathToBackupScript = `${__dirname}/../trigger-operational-data-backup.sh`
    void this.lg.log(ELogLevel.Info, `triggering backup via script: ${pathToBackupScript}`)
    // shelljs.exec(pathToBackupScript)
  }

  public getAuthenticationData(michaelsfriendskey: string): IAuthenticationData {
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

  public saveFundedTasks(fundedTasks: ITask[]): void {
    this.persistencyService.saveFundedTasks(fundedTasks)
  }

  public authorizeInstallation(): void {
    const userId = '123'
    void this.lg.log(ELogLevel.Info, `User: ${userId} authorized installation.`)
  }

  public getFundedTasks(): ITask[] {
    return this.persistencyService.getFundedTasks()
  }

  public getPotentialReceivers(): string[] {
    const authenticationData = this.persistencyService.getAuthenticationData()
    const potentialReceivers: string[] = []
    for (const entry of authenticationData) {
      potentialReceivers.push(entry.login)
    }

    void this.lg.log(ELogLevel.Debug, `I found ${potentialReceivers.length} receivers`)

    return potentialReceivers
  }

  public getLedgerEntries(): ILedgerEntry[] {
    return this.ledgerConnector.getLedgerEntries()
  }

  public async saveFunding(taskAndFunding: ITaskAndFunding, userAccessToken: string): Promise<ILedgerEntry> {

    const authenticationData = this.authenticationService.getAuthenticationDataFromMemory(userAccessToken)
    if (authenticationData === undefined) {
      throw new Error(`I could not find authentication Data for this token: ${userAccessToken}`)
    }

    const newLedgerEntry: ILedgerEntry = this.createLedgerEntryFromFunding(taskAndFunding.funding)

    const tasks = this.persistencyService.getFundedTasks()
    const existingTask = tasks.filter((entry: ITask) => entry.link === taskAndFunding.task.link)[0]

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

    this.persistencyService.saveFundedTasks(tasks)

    await this.gitHubIntegration.postCommentAboutSuccessfullFunding(taskAndFunding.task.link, taskAndFunding.funding)
    void this.lg.log(ELogLevel.Notification, `I received a funding of ${taskAndFunding.funding.amount} EIC for the following task: ${task.link}`)

    return newLedgerEntry

  }

  public postTransfer(receivers: IBountyReceiver[], userAccessToken: string): ILedgerEntry[] {

    const authenticationData = this.authenticationService.getAuthenticationDataFromMemory(userAccessToken)
    if (authenticationData === undefined) {
      throw new Error(`I could not find authentication Data for this token: ${userAccessToken}`)
    }

    const newLedgerEntries: ILedgerEntry[] = this.createLedgerEntriesFromBountyPayment(receivers)
    void this.lg.log(ELogLevel.Info, `I created the following ledger entries: ${JSON.stringify(newLedgerEntries)} `)

    // this.gitHubIntegration.postCommentAboutSuccessfullTransfer(taskAndFunding.task.link, taskAndFunding.funding)
    // this.lg.log(ELogLevel.Notification, `I received a funding of ${taskAndFunding.funding.amount} EIC for the following task: ${task.link}`)
    return newLedgerEntries

  }

  private createLedgerEntryFromFunding(funding: IFunding): ILedgerEntry {
    const entries: ILedgerEntry[] = this.ledgerConnector.getLedgerEntries()
    let entry: ILedgerEntry
    entry = {
      id: `tr-${Date.now().toString()}`,
      date: new Date().toISOString(),
      amount: funding.amount,
      sender: funding.funderId,
      receiver: funding.taskLink,
    }

    entries.push(entry)

    this.ledgerConnector.saveLedgerEntries(entries)

    return entry
  }

  private createLedgerEntriesFromBountyPayment(receivers: IBountyReceiver[]): ILedgerEntry[] {
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

    const entries: ILedgerEntry[] = this.ledgerConnector.getLedgerEntries()
    entries.push(entry)
    this.ledgerConnector.saveLedgerEntries(entries)

    return newEntries
  }

}
