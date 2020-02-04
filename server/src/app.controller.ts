import { Controller, Get, Param, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { pathToStaticAssets } from './gitcoin-enterprise-server'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Res() res: any): void {
    res.sendFile(`${pathToStaticAssets}/i-want-compression-via-route.html`)
  }

  @Get('getissue/owner/:owner/repo/:repo/issueid/:issueId')
  getIssue(@Param('owner') owner: string, @Param('repo') repo: string, @Param('issueId') issueId: number) {
    return this.appService.getIssue(owner, repo, issueId)
  }

}
