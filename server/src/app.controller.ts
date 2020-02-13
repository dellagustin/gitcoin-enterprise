import { Controller, Get, Param, Res, Post, Req } from '@nestjs/common'
import { AppService } from './app.service'
import { pathToStaticAssets } from './gitcoin-enterprise-server'
import { ITask, IAuthenticationData } from './interfaces'
import { GithubIntegrationService } from './github-integration/github-integration.service'
import { ILedgerEntry } from './ledger-connector/ledger-connector.interface'

@Controller()
export class AppController {

  constructor(private readonly appService: AppService, private readonly gitHubIntegration: GithubIntegrationService) {}

  @Get('/')
  getHello(@Res() res: any): void {
    // const sessionWithoutCookies = uuidv1().replace(/-/g, '').substr(0, 10)
    res.sendFile(`${pathToStaticAssets}/i-want-compression-via-route.html`)
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
