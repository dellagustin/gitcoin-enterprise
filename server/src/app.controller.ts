import { Controller, Get, Param, Res, Post, Req } from '@nestjs/common'
import { AppService } from './app.service'
import { ITask, IAuthenticationData } from './interfaces'
import { GithubIntegrationService } from './github-integration/github-integration.service'
import { ILedgerEntry } from './ledger-connector/ledger-connector.interface'
import { LoggerService } from './logger/logger.service'
import { ELogLevel } from './logger/logger-interface'
const uuidv1 = require('uuidv1')
import * as fs from 'fs-sync'
import * as path from 'path'

@Controller()
export class AppController {

  constructor(private readonly appService: AppService, private readonly gitHubIntegration: GithubIntegrationService, private readonly lg: LoggerService) { }

  @Get('/')
  getHello(@Req() req: any, @Res() res: any): void {
    this.lg.log(ELogLevel.Info, `request received from ${req.connection.remoteAddress}`)

    res.sendFile(path.join(__dirname, '../docs/i-want-compression-via-route.html'))
  }

  @Get('/getLedgerEntries')
  getLedgerEntries(@Req() req: any): ILedgerEntry[] {
    const login = this.appService.getLoginFromToken(req.headers.michaelsfriendskey)
    return this.appService.getLedgerEntries(login)
  }

  @Get('/getIssueInfo/org/:org/repo/:repo/issueid/:issueId')
  getIssue(@Param('org') org: string, @Param('repo') repo: string, @Param('issueId') issueId: number) {
    return this.gitHubIntegration.getIssue(org, repo, issueId)
  }

  @Get('/getFundedTasks')
  getFundedTasks(): ITask[] {
    return this.appService.getFundedTasks()
  }

  @Get('/getAuthenticationData')
  getAuthenticationData(@Req() req: any): IAuthenticationData {
    return this.appService.getAuthenticationData(req.headers.michaelsfriendskey)
  }

  @Post('/postFunding')
  saveFunding(@Req() req: any): Promise<ILedgerEntry> {
    return this.appService.saveFunding(req.body, req.headers.michaelsfriendskey)
  }

  @Post('/postApplication')
  applyForSolving(@Req() req: any): Promise<void> {
    return this.appService.applyForSolving(req.body, req.headers.michaelsfriendskey)
  }

}
