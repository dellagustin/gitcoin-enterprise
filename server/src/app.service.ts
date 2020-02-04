import { Injectable } from '@nestjs/common';
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit();
import * as fs from 'fs-sync';
import * as path from 'path';
import { IssueInfo } from './interfaces'

@Injectable()
export class AppService
{

  private gitHubToken = '';

  public constructor()
  {
    // tbd
  }

  public getHello(): string
  {
    return 'Hello World!';
  }

  public async getIssue(owner: any, repo: any, issueId: any): Promise<IssueInfo>
  {
    try {
      const issueInfo = {} as IssueInfo;
      const response = await octokit.issues.get({
        owner: owner,
        repo: repo,
        issue_number: issueId
      });
      issueInfo.title = response.data.title;
      issueInfo.description = response.data.body;
      return issueInfo;
    } catch (error) {
      console.log(`the github call to get the issue failed ${error}`);
    }

  }


  public getGitHubToken(): string
  {
    return fs.readJSON(path.join(__dirname, '../.env.json')).gitHubToken;
  }

}
