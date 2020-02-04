import { Injectable } from '@nestjs/common';
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit();
import * as fs from 'fs-sync';
import * as path from 'path';

@Injectable()
export class AppService {

  private gitHubToken = '';

  public constructor() {
    // tbd
  }

  public getHello(): string {
    return 'Hello World!';
  }

  public getIssue(org: any, repo: any, issueId: any) {
    console.log(org);
    console.log(repo);
    console.log(issueId);

    return {
      issueTitle: 'my issue title',
      issueDescription: 'my issue description'
    };
  }

  public async  getIssues(): Promise<boolean> {
    try {
      const response = await octokit.issues.listForRepo({
        owner: 'gitcoin-enterprise',
        repo: 'gitcoin-enterprise',
      });
      return response.data;
    } catch (error) {
      console.log(`the github call to get the issues failed ${error}`);
    }
  }

  public getGitHubToken(): string {
    return fs.readJSON(path.join(__dirname, '../.env.json')).gitHubToken;
  }

}
