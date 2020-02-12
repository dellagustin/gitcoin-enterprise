import { NestMiddleware, Injectable } from '@nestjs/common'
import { Response } from 'express'
import { config } from '../app.module'
import { LoggerService } from '../logger/logger.service'
import { ELogLevel } from '../logger/logger-interface'
import { SupportNotifierService } from '../support-notifier/support-notifier.service'
import { AuthenticationService } from './authentication.service'
import { IAuthenticationData } from '../interfaces'
const axios = require('axios')

export class AuthenticationMiddleware implements NestMiddleware {

  private readonly lg: LoggerService
  private readonly authenticationService: AuthenticationService

  public constructor() {
    this.lg = new LoggerService(new SupportNotifierService())
    this.authenticationService = new AuthenticationService(this.lg)
  }

  public async use(req: any, res: Response, next: any): Promise<void> {
    // tslint:disable-next-line: no-console
    console.log('middleware executed')
    if (this.isUserAuthenticated(req.headers.michaelsfriendskey)) {
      next()
    } else {
      res.redirect(`${config.backendURL}/login`)
    }
  }

  private isUserAuthenticated(michaelsfriendskey: string): boolean {
    const authenticationData: IAuthenticationData = this.authenticationService.getAuthenticationData(michaelsfriendskey)

    if (authenticationData === undefined) { return false }
    if (authenticationData.login === '') { return false }

    return true
  }

}
