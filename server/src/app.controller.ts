import { Controller, Get, Param, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { pathToStaticAssets } from './gitcoin-enterprise-server'
import { ITask, ILedgerEntry } from './interfaces'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Res() res: any): void {
    res.sendFile(`${pathToStaticAssets}/i-want-compression-via-route.html`)
  }

  @Get('/getFundedTasks')
  getFundedTasks(): ITask[] {
    return this.appService.getFundedTasks()
  }

  @Get('/getLedgerEntries')
  getLedgerEntries(): ILedgerEntry[] {
    return this.appService.getLedgerEntries()
  }

  @Get('/getIssueInfo/org/:org/repo/:repo/issueid/:issueId')
  getIssue(@Param('org') org: string, @Param('repo') repo: string, @Param('issueId') issueId: number) {
    return this.appService.getIssue(org, repo, issueId)
  }

}
