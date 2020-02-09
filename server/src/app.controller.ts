import { Controller, Get, Param, Res, Post, Req } from '@nestjs/common'
import { AppService } from './app.service'
import { pathToStaticAssets } from './gitcoin-enterprise-server'
import { ITask, IUser } from './interfaces'
import { EmailService } from './email/email.service'
import { ILedgerEntry } from './ledger-connector.interface'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly eMailService: EmailService) { }

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

  @Get('/getUser')
  getUser(@Req() req: any): IUser {
    return this.appService.getUser(req.headers.companyuserid)
  }

  @Get('/getIssueInfo/org/:org/repo/:repo/issueid/:issueId')
  getIssue(@Param('org') org: string, @Param('repo') repo: string, @Param('issueId') issueId: number) {
    return this.appService.getIssue(org, repo, issueId)
  }

  @Post('/sendEMail')
  sendEMail(@Req() req: any) {
    return this.eMailService.sendEMail(req.body)
  }

  @Post('/saveFunding')
  saveFunding(@Req() req: any): ILedgerEntry {
    return this.appService.saveFunding(req.body, req.headers.companyuserid)
  }

  @Post('/applyForSolving')
  applyForSolving(@Req() req: any): void {
    return this.appService.applyForSolving(req.headers.companyuserid, req.body.profileLink, req.body.taskLink)
  }

}
