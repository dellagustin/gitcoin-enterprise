import { Injectable } from '@nestjs/common'
const { Octokit } = require('@octokit/rest')
const octokit = new Octokit()
import * as fs from 'fs-sync'
import * as path from 'path'
import { IssueInfo, ITask, ILedgerEntry, ETaskStatus, ETaskType } from './interfaces'
import { LoggerService, ELogLevel } from './logger/logger.service'

@Injectable()
export class AppService {

  private gitHubToken = ''
  private fundedTasksFileId = path.join(__dirname, '../operational-data/funded-tasks.json')
  private ledgerEntriesFileId = path.join(__dirname, '../operational-data/ledger-entries.json')

  public constructor(private readonly loggerService: LoggerService) {
    // tbd
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

  public saveLedgerEntries(ledgerEntries: ILedgerEntry[]): void {
    return fs.write(this.ledgerEntriesFileId, JSON.stringify(ledgerEntries))
  }

  public getFundedTasks(): ITask[] {
    return fs.readJSON(this.fundedTasksFileId)

  }

  public getDefaultTaskForDemo(): ITask {
    return {
      taskType: ETaskType.GitHubIssue,
      name: 'Just a Demo Task',
      description: 'Just a Demo Description',
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5,
      link: 'https://github.com/cla-assistant/cla-assistant/issues/530',
      dueDate: '2020-01-08',
    }

  }

  public getLedgerEntries(): ILedgerEntry[] {

    return fs.readJSON(this.ledgerEntriesFileId)
  }

}
