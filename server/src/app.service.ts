import { Injectable } from '@nestjs/common';
import * as fs from 'fs-sync'
import * as path from 'path'

@Injectable()
export class AppService {

  private gitHubToken = ''

  public constructor() {
    // tbd
  }

  public getIssues(): string[] {
    return [];
  }

  public getHello(): string {
    return 'Hello World!';
  }

  public getGitHubToken(): string {
    return fs.readJSON(path.join(__dirname, '../.env.json')).gitHubToken;
  }

}
