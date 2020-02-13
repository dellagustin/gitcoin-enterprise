import { NestMiddleware, Injectable } from '@nestjs/common'
import { Response } from 'express'
import { config } from '../app.module'
import { LoggerService } from '../logger/logger.service'
import { ELogLevel } from '../logger/logger-interface'
import { SupportNotifierService } from '../support-notifier/support-notifier.service'
import { AuthenticationService } from './authentication.service'
import { IAuthenticationData } from '../interfaces'
import { GithubIntegrationService } from '../github-integration/github-integration.service'
import { LedgerConnector } from '../ledger-connector/ledger-connector-file-system.service'
const axios = require('axios')

export class AuthenticationMiddleware implements NestMiddleware {

  private readonly lg: LoggerService
  private readonly authenticationService: AuthenticationService

  public constructor() {
    this.lg = new LoggerService(new SupportNotifierService())
    this.authenticationService = new AuthenticationService(this.lg, new GithubIntegrationService(this.lg, new LedgerConnector()))
  }

  public async use(req: any, res: Response, next: any): Promise<void> {
    // tslint:disable-next-line: no-console
    const requestURL = req.protocol + '://' + req.get('host') + req.originalUrl
    this.lg.log(ELogLevel.Info, `middleware executed for ${requestURL}`)
    if (this.isUserAuthenticated(req.headers.michaelsfriendskey)) {
      next()
    } else {
      const message = `I received an unauthorized call to: ${requestURL} with key ${JSON.stringify(req.headers)}`
      this.lg.log(ELogLevel.Error, message)
      throw new Error(message)
    }
  }

  private isUserAuthenticated(michaelsfriendskey: string): boolean {
    const authenticationData: IAuthenticationData = this.authenticationService.getAuthenticationDataFromMainMemory(michaelsfriendskey)

    if (authenticationData === undefined) { return false }
    if (authenticationData.login === '') { return false }

    return true
  }

}
