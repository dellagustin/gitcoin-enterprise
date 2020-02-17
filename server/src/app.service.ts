import { Injectable } from '@nestjs/common'

import * as fs from 'fs-sync'
import * as path from 'path'
import { ITask, ETaskStatus, ETaskType, IUser, IFunding, ITaskAndFunding, IApplication, IAuthenticationData } from './interfaces'
import { LoggerService } from './logger/logger.service'
import { LedgerConnector } from './ledger-connector/ledger-connector-file-system.service'
import { GithubIntegrationService } from './github-integration/github-integration.service'
import { ILedgerEntry } from './ledger-connector/ledger-connector.interface'
import { ELogLevel } from './logger/logger-interface'
import { AuthenticationService } from './authentication/authentication.service'
import { config } from './app.module'
import { PersistencyService } from './persistency/persistency.service'

@Injectable()
export class AppService {
  getLoginFromToken(token: string) {
    return this.getAuthenticationData(token).login
  }

  // Interface would be cool for LedgerConnector... The reason why I could not use interface polymorphism here is interfaces are design-time only in the current context :)
  public constructor(private readonly lg: LoggerService, private readonly ledgerConnector: LedgerConnector, private readonly gitHubIntegration: GithubIntegrationService, private readonly authenticationService: AuthenticationService, private readonly persistencyService: PersistencyService) {
  }

  public getAuthenticationData(michaelsfriendskey: string): IAuthenticationData {
    return this.authenticationService.getAuthenticationDataFromMainMemory(michaelsfriendskey)
  }

  public async applyForSolving(application: IApplication, userAccessToken: string): Promise<void> {
    const authenticationData = await this.authenticationService.getAuthenticationDataFromMainMemory(userAccessToken)
    if (authenticationData === undefined) {
      throw new Error('Authentication data not found for this token')
    }
    this.gitHubIntegration.postCommentAboutApplication(application)
  }

  public getGitHubToken(): string {
    return config.token
  }

  public saveFundedTasks(fundedTasks: ITask[]): void {
    this.persistencyService.saveFundedTasks(fundedTasks)
  }

  public authorizeInstallation(): void {
    const userId = '123'
    this.lg.log(ELogLevel.Info, `User: ${userId} authorized installation.`)
  }

  // public handleOAuthCallbackRequest(): void {
  //   const calbackRequestData = 'calbackRequestData'
  //   this.lg.log(ELogLevel.Info, `OAuthCallBackRequest Received: ${calbackRequestData}`)
  // }

  // public async ghAppWebHookURL(): Promise<void> {
  //   const trigger = 'tbd'
  //   await this.lg.log(ELogLevel.Info, `Webhook URL: ${trigger}`)
  // }

  public getFundedTasks(): ITask[] {
    return this.persistencyService.getFundedTasks()

  }

  public getDefaultTaskForDemo(): ITask {
    return {

      taskType: ETaskType.GitHubIssue,
      title: 'Just a Demo Task',
      description: 'Just a Demo Description',
      funding: 0,
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5,
      link: 'https://github.com/gitcoin-enterprise/gitcoin-enterprise/issues/16',
      dueDate: '2020-01-08',
    }
  }

  public getLedgerEntries(login: string): ILedgerEntry[] {

    return this.ledgerConnector.getLedgerEntries(login)
  }

  public async saveFunding(taskAndFunding: ITaskAndFunding, userAccessToken: string): Promise<ILedgerEntry> {

    const authenticationData = await this.authenticationService.getAuthenticationDataFromMainMemory(userAccessToken)
    if (authenticationData === undefined) {
      throw new Error(`I could not find authentication Data for this token: ${userAccessToken}`)
    }

    const newLedgerEntry: ILedgerEntry = this.createLedgerEntry(taskAndFunding.funding)

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

    this.gitHubIntegration.postCommentAboutSuccessfullFunding(taskAndFunding.task.link, taskAndFunding.funding)
    return newLedgerEntry

  }

  private createLedgerEntry(funding: IFunding): ILedgerEntry {
    const entries: ILedgerEntry[] = this.ledgerConnector.getLedgerEntries(funding.funderId)
    const entry: ILedgerEntry = {
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

}
