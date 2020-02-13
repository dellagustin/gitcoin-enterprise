import { Controller, Get, Param, Res, Post, Req } from '@nestjs/common'
import { AppService } from './app.service'
import { pathToStaticAssets } from './gitcoin-enterprise-server'
import { ITask, IAuthenticationData } from './interfaces'
import { GithubIntegrationService } from './github-integration/github-integration.service'
import { ILedgerEntry } from './ledger-connector/ledger-connector.interface'
import { LoggerService } from './logger/logger.service'
import { ELogLevel } from './logger/logger-interface'

@Controller()
export class AppController {

  constructor(private readonly appService: AppService, private readonly gitHubIntegration: GithubIntegrationService, private readonly lg: LoggerService) { }

  @Get('/')
  getHello(@Req() req: any, @Res() res: any): void {
    this.lg.log(ELogLevel.Info, `request received from ${req.connection.remoteAddress}`)
    // const sessionWithoutCookies = uuidv1().replace(/-/g, '').substr(0, 10)
    res.sendFile(`${pathToStaticAssets}/i-want-compression-via-route.html`)
  }

  @Get('/test')
  test(@Req() req: any, @Res() res: any): void {
    this.lg.log(ELogLevel.Info, `request received from ${req.connection.remoteAddress}`)
    // const sessionWithoutCookies = uuidv1().replace(/-/g, '').substr(0, 10)
    res.send('supergeil')
  }

  @Get('/getLedgerEntries')
  getLedgerEntries(): ILedgerEntry[] {
    return this.appService.getLedgerEntries()
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
