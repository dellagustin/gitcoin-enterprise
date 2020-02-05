import { Injectable } from '@nestjs/common'
const { Octokit } = require('@octokit/rest')
const octokit = new Octokit()
import * as fs from 'fs-sync'
import * as path from 'path'
import { IssueInfo } from './interfaces'
import { LoggerService, ELogLevel } from './logger/logger.service'

@Injectable()
export class AppService {

  private gitHubToken = ''

  public constructor(private readonly loggerService: LoggerService) {
    // tbd
  }

  public async getIssue(org: any, repo: any, issueId: any): Promise<IssueInfo> {
    this.loggerService.log(ELogLevel.Info, `getting Issue data for owner: ${org}, repo: ${repo}, issueId: ${issueId}`)
    try {
      const issueInfo = {} as IssueInfo
      const response = await octokit.issues.get({
        owner: org,
        repo,
        issue_number: issueId,
      })
      issueInfo.title = response.data.title
      issueInfo.description = response.data.body
      return issueInfo
    } catch (error) {
      this.loggerService.log(ELogLevel.Error, `the github call to get the issue failed ${error}`)
    }

  }

  public getGitHubToken(): string {
    return fs.readJSON(path.join(__dirname, '../.env.json')).gitHubToken
  }

}
