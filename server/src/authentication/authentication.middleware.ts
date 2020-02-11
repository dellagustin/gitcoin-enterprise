import { NestMiddleware, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { config } from '../app.module'
import { LoggerService } from '../logger/logger.service'
import { ELogLevel } from '../logger/logger-interface'
import { SupportNotifierService } from '../support-notifier/support-notifier.service'
const axios = require('axios')

export class AuthenticationMiddleware implements NestMiddleware {
  // tslint:disable-next-line: ban-types
  public constructor(private readonly lg: LoggerService) {
    this.lg = new LoggerService(new SupportNotifierService())
  }
  // tslint:disable-next-line: ban-types
  public async use(req: any, res: Response, next: Function): Promise<void> {
    this.lg.log(ELogLevel.Info, req.headers.michaelsfriendskey)
    if (this.isUserAuthenticated()) {
      next()
    } else {
      res.redirect(`${config.backendURL}/login`)
    }
  }
  private isUserAuthenticated(): boolean {
    return true
  }
}
