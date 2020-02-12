import { Controller, Get, Param, Res, Post, Req, Query } from '@nestjs/common'
import { AppService } from './app.service'
import { pathToStaticAssets } from './gitcoin-enterprise-server'
import { ITask, IUser } from './interfaces'
import { GithubIntegrationService } from './github-integration/github-integration.service'
import { ILedgerEntry } from './ledger-connector/ledger-connector.interface'
import { config } from './app.module'
import * as fs from 'fs-sync'
import * as uuidv1 from 'uuid/v1'
import { AuthenticationService } from './authentication/authentication.service'

@Controller()
export class AppController {

  private githubOAuth: any
  userService: any

  constructor(private readonly appService: AppService, private readonly gitHubIntegration: GithubIntegrationService, private readonly authenticationService: AuthenticationService) {

    this.githubOAuth = require('./github-oauth/gh-oauth-implement-a-typescript-version-soon')({
      githubClient: config.gitHubOAuthClient,
      githubSecret: config.gitHubOAuthSecret,
      baseURL: config.backendURL,
      loginURI: '/login',
      callbackURI: '/callback',
      scope: 'user', // optional, default scope is set to user
    })

    // this.githubOAuth.on('error', (err, resp, tokenResp, req) => {
    this.githubOAuth.on('error', (body, err, resp, tokenResp, req) => {
      // tslint:disable-next-line: no-console
      console.error('there was a login error', err)
      // console.error('there was a login error', body)
    })

    this.githubOAuth.on('token', async (token, serverResponse, tokenResp, req) => {

      AppService.authenticationData = await this.gitHubIntegration.getAuthenticationData(token.access_token)

      // fs.write(`${pathToStaticAssets}/i-want-compression-via-route.html`, fs.read(`${pathToStaticAssets}/i-want-compression-via-route.html`)
      //   .replace('authentificationTokenContent', AppService.authenticationData.token))

      serverResponse.send(fs.read(`${pathToStaticAssets}/i-want-compression-via-route.html`)
        .replace('authentificationTokenContent', AppService.authenticationData.token))
      // serverResponse.sendFile(`${pathToStaticAssets}/i-want-compression-via-route.html`)
      // serverResponse.redirect(`${config.backendURL}?token=${AppService.authenticationData.token}`)
    })
  }

  @Get('/')
  getHello(@Res() res: any): void {
    // const sessionWithoutCookies = uuidv1().replace(/-/g, '').substr(0, 10)
    res.sendFile(`${pathToStaticAssets}/i-want-compression-via-route.html`)
  }

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

  @Get('/getFundedTasks')
  getFundedTasks(): ITask[] {
    return this.appService.getFundedTasks()
  }

  @Get('/postFunding')
  getIt(@Req() req: any): void {

    // return this.appService.saveFunding(req.body, req.headers.companyuserid)
  }

  @Post('/postFunding')
  saveFunding(@Req() req: any): ILedgerEntry {
    return this.appService.saveFunding(req.body, req.headers.companyuserid)
  }

  @Post('/postApplication')
  applyForSolving(@Req() req: any): void {
    return this.appService.applyForSolving(req.headers.companyuserid, req.body)
  }

  @Get('/login')
  login(@Req() req: any, @Res() res: any, @Query('sessionWithoutCookies') sessionWithoutCookies: string): void {
    AppService.currentSessionWithoutCookiesLogin = ''
    if (AppService.currentSessionWithoutCookiesLogin !== '') {
      res.send('Currently there is too much traffic on this Hobby Server :) Please try again later.')
    } else {
      AppService.currentSessionWithoutCookiesLogin = sessionWithoutCookies
      setTimeout(() => {
        AppService.currentSessionWithoutCookiesLogin = ''
      }, 3 * 60 * 1000)
      return this.githubOAuth.login(req, res)
    }
  }

  @Get('/callback')
  callback(@Req() req: any, @Res() res: any): void {
    // this method handles the code - this is NOT THE ACCESS TOKEN yet
    return this.githubOAuth.callback(req, res)

  }

  // @Post('/sendEMail')
  // sendEMail(@Req() req: any) {
  //   return this.eMailService.sendEMail(req.body)
  // }

  // @Get('/ghAppUserAuthorizationCallbackURL')
  // authorizeInstallation(): void {
  //   this.appService.authorizeInstallation()
  // }

  // @Get('/ghAppWebHookURL')
  // ghAppWebHookURL(): void {
  //   this.appService.ghAppWebHookURL()
  // }

  // @Get('/testGHAppsBasedAuthentication')
  // async testGHAppsBasedAuthentication(): Promise<void> {
  //   await this.authenticationService.testGHAppsBasedAuthentication()
  // }

}
