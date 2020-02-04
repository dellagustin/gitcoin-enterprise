import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController
{
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string
  {
    return this.appService.getHello();
  }


  @Get('getissue/owner/:owner/repo/:repo/issueid/:issueId')
  getIssue(@Param('owner') owner: string, @Param('repo') repo: string, @Param('issueId') issueId: number)
  {
    return this.appService.getIssue(owner, repo, issueId);
  }

}
