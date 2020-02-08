import { Injectable } from '@nestjs/common'
const { Octokit } = require('@octokit/rest',
)

import * as fs from 'fs-sync'
import * as path from 'path'
import * as moment from 'moment'
import { IssueInfo, ITask, ETaskStatus, ETaskType, IUser, IFunding, ITaskAndFunding } from './interfaces'
import { LoggerService, ELogLevel } from './logger/logger.service'
import { ILedgerEntry } from './ledger-connector.interface'
import { LedgerConnector } from './ledger-connector/ledger-connector-file-system.service'

// set personal acceess token for posting issue comment
const config = fs.readJSON(path.join(__dirname, '../.env.json'))
const octokit = new Octokit({
  auth: config.token,
})

@Injectable()
export class AppService {

  private fundedTasksFileId = path.join(__dirname, '../operational-data/funded-tasks.json')
  private usersFileId = path.join(__dirname, '../operational-data/users.json')

  // Interface would be cool but interfaces are design-time only in the current context :)
  public constructor(private readonly loggerService: LoggerService, private readonly ledgerConnector: LedgerConnector) {
    // tbd
  }

  public getUser(userId: string): IUser {
    this.loggerService.log(ELogLevel.Info, `getting user ${userId}`)
    return fs.readJSON(this.usersFileId).filter((user: IUser) => user.id === userId)[0]
  }

  public applyForSolving(userId: string, profileLink: string, taskLink: string): void {
    const existingUser = fs.readJSON(this.usersFileId).filter((user: IUser) => user.id === userId)[0]
    if (existingUser === undefined) {
      throw new Error('User not found')
    }
    this.postCommentAboutApplication(profileLink, taskLink)
  }

  public async getIssue(org: any, repo: any, issueId: any): Promise<IssueInfo> {
    this.loggerService.log(ELogLevel.Info, `getting Issue data for owner: ${org}, repo: ${repo}, issueId: ${issueId}`)
    const issueInfo = {} as IssueInfo
    try {
      const response = await octokit.issues.get({
        owner: org,
        repo,
        issue_number: issueId,
      })
      issueInfo.title = response.data.title
      issueInfo.description = response.data.body
    } catch (error) {
      this.loggerService.log(ELogLevel.Error, `the github call to get the issue failed ${error}`)
      issueInfo.title = 'Just a demo Title'
      issueInfo.description = 'Just a demo Description'
    }

    return issueInfo
  }

  public getGitHubToken(): string {
    return fs.readJSON(path.join(__dirname, '../.env.json')).gitHubToken
  }

  public saveFundedTasks(fundedTasks: ITask[]): void {
    return fs.write(this.fundedTasksFileId, JSON.stringify(fundedTasks))
  }

  public getFundedTasks(): ITask[] {
    // this.initializeSystem()
    return fs.readJSON(this.fundedTasksFileId)

  }

  private initializeSystem() {
    fs.write(this.fundedTasksFileId, '[]')
    this.ledgerConnector.saveLedgerEntries([])
    fs.write(this.usersFileId, JSON.stringify(this.getDemoUsers()))
  }

  public getDefaultTaskForDemo(): ITask {
    return {
      id: '1',
      taskType: ETaskType.GitHubIssue,
      name: 'Just a Demo Task',
      description: 'Just a Demo Description',
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5,
      link: 'https://github.com/gitcoin-enterprise/gitcoin-enterprise/issues/16',
      dueDate: '2020-01-08',
    }
  }

  public getLedgerEntries(): ILedgerEntry[] {

    return this.ledgerConnector.getLedgerEntries()
  }

  public saveFunding(taskAndFunding: ITaskAndFunding, key: string): any {

    const user = fs.readJSON(this.usersFileId).filter((entry: IUser) => entry.id === key)[0]

    if (user === undefined) {
      return {
        message: 'I could not find an authorized user with this id.',
      }
    }

    this.createLedgerEntry(taskAndFunding.funding)

    const tasks = fs.readJSON(this.fundedTasksFileId)
    const existingTask = tasks.filter((entry: IUser) => entry.link === taskAndFunding.task.link)[0]

    let task: ITask
    if (existingTask === undefined) {
      task = taskAndFunding.task
      task.id = Date.now().toString()
    } else {
      task = existingTask
      task.funding = task.funding + taskAndFunding.funding.amount
      const indexOfExistingTasks = tasks.indexOf(existingTask)
      tasks.splice(indexOfExistingTasks, 1)
    }

    tasks.push(task)

    fs.write(this.fundedTasksFileId, JSON.stringify(tasks))

    this.postCommentAboutSuccessfullFunding(taskAndFunding.task.link, taskAndFunding.funding)
    return {
      message: 'successfully funded the task',
    }

  }

  private async postCommentAboutSuccessfullFunding(linkToIssue: string, funding: IFunding) {
    const body = 'peer2peer collaborating is awesome (funder)'
    // cla-assistant/cla-assistant/issues/530
    const owner = linkToIssue.split('/')[3]
    const repoName = linkToIssue.split('/')[4]
    const issueNo = linkToIssue.split('/')[6]

    try {
      await octokit.issues.createComment({
        owner,
        repo: repoName,
        issue_number: issueNo,
        body,
      })

    } catch (error) {
      this.loggerService.log(ELogLevel.Error, `the github call to create a comment for  the issue failed ${error}`)

    }

    this.loggerService.log(ELogLevel.Info, linkToIssue)
    this.loggerService.log(ELogLevel.Info, JSON.stringify(funding))
  }

  private async postCommentAboutApplication(profileLink: string, taskLink: string) {
    const body = 'peer2peer collaborating is awesome (contributor) '

    const owner = taskLink.split('/')[3]
    const repoName = taskLink.split('/')[4]
    const issueNo = taskLink.split('/')[6]
    try {
      await octokit.issues.createComment({
        owner,
        repo: repoName,
        issue_number: issueNo,
        body,
      })

    } catch (error) {
      this.loggerService.log(ELogLevel.Error, `the github call to create a comment for  the issue failed ${error}`)

    }
    this.loggerService.log(ELogLevel.Info, profileLink)
    this.loggerService.log(ELogLevel.Info, taskLink)
  }

  private createLedgerEntry(funding: IFunding) {
    const entries: ILedgerEntry[] = this.ledgerConnector.getLedgerEntries()
    const entry: ILedgerEntry = {
      id: Date.now().toString(),
      date: moment().format('YYYY MM DD'),
      amount: funding.amount,
      sender: funding.funderId,
      receiver: funding.taskId,
    }

    entries.push(entry)

    this.ledgerConnector.saveLedgerEntries(entries)
  }

  public getDemoUsers() {
    const users: IUser[] = []

    const michael: IUser = {
      balance: 1000,
      id: 'd123',
      firstName: 'Michael',
      link: 'https://github.com/michael-spengler',
    }
    users.push(michael)

    const akshay: IUser = {
      balance: 2000,
      id: 'd124',
      firstName: 'Akshay',
      link: 'https://github.com/ibakshay',
    }
    users.push(akshay)

    const fabian: IUser = {
      balance: 3000,
      id: 'd125',
      firstName: 'Fabian',
      link: 'https://github.com/fabianriewe',
    }

    users.push(fabian)

    return users
  }
}
