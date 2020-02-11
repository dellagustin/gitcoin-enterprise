import { Controller, Get, Param, Res, Post, Req } from '@nestjs/common'
import { AppService } from './app.service'
import { pathToStaticAssets } from './gitcoin-enterprise-server'
import { ITask, IUser } from './interfaces'
import { EmailService } from './email/email.service'
import { GithubIntegrationService } from './github-integration/github-integration.service'
import { ILedgerEntry } from './ledger-connector/ledger-connector.interface'
import { config } from './app.module'
import { AuthorizationService } from './authorization/authorization.service'
import * as fs from 'fs-sync'
import * as uuidv1 from 'uuid/v1'

@Controller()
export class AppController {

  private githubOAuth: any
  userService: any

  constructor(private readonly appService: AppService, private readonly eMailService: EmailService, private readonly gitHubIntegration: GithubIntegrationService, private authorizationService: AuthorizationService) {

    this.githubOAuth = require('./github-oauth/gh-oauth-implement-a-typescript-version-soon.ts')({
      githubClient: config.gitHubOAuthClient,
      githubSecret: config.gitHubOAuthSecret,
      baseURL: config.backendURL,
      loginURI: '/login',
      callbackURI: '/callback',
      scope: 'user', // optional, default scope is set to user
    })

    this.githubOAuth.on('error', (err) => {
      // tslint:disable-next-line: no-console
      console.error('there was a login error', err)
    })

    this.githubOAuth.on('token', (token, serverResponse) => {
      // tslint:disable-next-line: no-console
      console.log('here is your shiny new github oauth token', token)
      this.authorizationService.storeAuthorization(token)
      serverResponse.end(JSON.stringify(token))
    })
  }

  @Get('')
  getHello(@Res() res: any): void {
    const sessionWithoutCookies = uuidv1()
    fs.write(`${pathToStaticAssets}/i-want-compression-via-route.html`, fs.read(`${pathToStaticAssets}/i-want-compression-via-route.html`)
      .replace('toBeReplacedBeforeDeliveringTheIndex.html', sessionWithoutCookies))
    this.appService.addUser(sessionWithoutCookies)
    res.sendFile(`${pathToStaticAssets}/i-want-compression-via-route.html`)
  }

  @Get('/login')
  login(@Req() req: any, @Res() res: any): void {
    return this.githubOAuth.login(req, res)
  }

  @Get('/callback')
  callback(@Req() req: any, @Res() res: any): void {
    return this.githubOAuth.callback(req, res)
  }

  @Get('/ghAppUserAuthorizationCallbackURL')
  authorizeInstallation(): void {
    this.appService.authorizeInstallation()
  }

  @Get('/ghAppWebHookURL')
  ghAppWebHookURL(): void {
    this.appService.ghAppWebHookURL()
  }

  @Get('/getFundedTasks')
  getFundedTasks(): ITask[] {
    return this.appService.getFundedTasks()
  }

  // @Get('/testGHAppsBasedAuthentication')
  // async testGHAppsBasedAuthentication(): Promise<void> {
  //   await this.authenticationService.testGHAppsBasedAuthentication()
  // }

  @Get('/getLedgerEntries')
  getLedgerEntries(): ILedgerEntry[] {
    return this.appService.getLedgerEntries()
  }

  @Get('/getUser')
  getUser(@Req() req: any): Promise<IUser> {
    return this.appService.getUser(req.headers.companyuserid)
  }

  @Get('/getIssueInfo/org/:org/repo/:repo/issueid/:issueId')
  getIssue(@Param('org') org: string, @Param('repo') repo: string, @Param('issueId') issueId: number) {
    return this.gitHubIntegration.getIssue(org, repo, issueId)
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
    return this.appService.applyForSolving(req.headers.companyuserid, req.body)
  }

}
