import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('getissues')
  getIssues() {
    return this.appService.getIssues();
  }

  @Get('getissue/org/:org/repo/:repo/issueId/:issueId')
  getIssue(@Param('org') org: string, @Param('repo') repo: string, @Param('issueId') issueId: string) {
    return this.appService.getIssue(org, repo, issueId );
  }

}
