import { NestMiddleware } from '@nestjs/common'
import { Response } from 'express'
import { LoggerService } from '../logger/logger.service'
import { ELogLevel } from '../logger/logger-interface'
import { SupportNotifierService } from '../support-notifier/support-notifier.service'
import { AuthenticationService } from './authentication.service'
import { GithubIntegrationService } from '../github-integration/github-integration.service'
import { PersistencyService } from '../persistency/persistency.service'

export class AuthenticationMiddleware implements NestMiddleware {

  private readonly lg: LoggerService
  private readonly authenticationService: AuthenticationService

  public constructor() {
    const persistencyService = new PersistencyService()
    this.lg = new LoggerService(new SupportNotifierService(), persistencyService)
    this.authenticationService =
      new AuthenticationService(this.lg, new GithubIntegrationService(this.lg, persistencyService), persistencyService)
  }

  public async use(req: any, res: Response, next: any): Promise<void> {
    // tslint:disable-next-line: prefer-template
    const requestURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    void this.lg.log(ELogLevel.Debug, `middleware executed for ${requestURL}`)
    if (await this.authenticationService.isUserAuthenticated(req.headers.michaelsfriendskey)) {
      next()
    } else {
      const message = `I received an unauthorized call to: ${requestURL} with key ${JSON.stringify(req.headers)}`
      void this.lg.log(ELogLevel.Warning, message)
      res.send('If a valuable feature for you is missing please raise a Pull Request.')
    }
  }
}
