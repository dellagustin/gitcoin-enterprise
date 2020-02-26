import { Controller, Get, Param, Res, Post, Req } from '@nestjs/common'
import { AppService } from './app.service'
import { ITask, IAuthenticationData } from './interfaces'
import { GithubIntegrationService } from './github-integration/github-integration.service'
import { ILedgerEntry } from './ledger-connector/ledger-connector.interface'
import { LoggerService } from './logger/logger.service'
import { ELogLevel } from './logger/logger-interface'
import * as path from 'path'
import * as fs from 'fs-sync'
import { config } from './app.module'

@Controller()
export class AppController {

  // for quicker access & delivery
  private readonly indexFileContent = fs.read(path.join(__dirname, '../docs/i-want-compression-via-route.html'))

  public constructor(private readonly appService: AppService, private readonly gitHubIntegration: GithubIntegrationService, private readonly lg: LoggerService) {
    // providing the github URL --> flexibility for GHE
    this.indexFileContent = this.indexFileContent.replace('gitHubURLIdContent', config.gitHubURL)
    this.indexFileContent = this.indexFileContent.replace('frontendURLContent', config.frontendURL)
    this.indexFileContent = this.indexFileContent.replace('backendURLContent', config.backendURL)
  }

  @Get('/')
  public getHello(@Req() req: any, @Res() res: any): void {
    void this.lg.log(ELogLevel.Info, `request received from ${req.connection.remoteAddress}`)

    // res.sendFile(path.join(__dirname, '../docs/i-want-compression-via-route.html'))
    res.send(this.indexFileContent)
  }

  @Get('/getLedgerEntries')
  public getLedgerEntries(@Req() req: any): ILedgerEntry[] {
    // const login = this.appService.getLoginFromToken(req.headers.michaelsfriendskey)
    return this.appService.getLedgerEntries()
  }

  @Get('/getIssueInfo/org/:org/repo/:repo/issueId/:issueId')
  public async getIssue(@Param('org') org: string, @Param('repo') repo: string, @Param('issueId') issueId: string): Promise<any> {

    return this.gitHubIntegration.getIssue(org, repo, issueId)
  }

  @Get('/getFundedTasks')
  public getFundedTasks(): ITask[] {
    return this.appService.getFundedTasks()
  }

  @Get('/getAuthenticationData')
  public getAuthenticationData(@Req() req: any): IAuthenticationData {
    return this.appService.getAuthenticationData(req.headers.michaelsfriendskey)
  }

  @Post('/postFunding')
  public async saveFunding(@Req() req: any): Promise<ILedgerEntry> {
    return this.appService.saveFunding(req.body, req.headers.michaelsfriendskey)
  }

  @Post('/triggerBackup')
  public triggerBackup(@Req() req: any): void {
    this.appService.triggerBackup()
  }

  @Post('/postTransfer')
  public async postTransfer(@Req() req: any): Promise<ILedgerEntry[]> {
    return this.appService.postTransfer(req.body, req.headers.michaelsfriendskey)
  }

  @Post('/postSolutionApproach')
  public async postSolutionApproach(@Req() req: any): Promise<void> {
    return this.appService.postSolutionApproach(req.body, req.headers.michaelsfriendskey)
  }

}
