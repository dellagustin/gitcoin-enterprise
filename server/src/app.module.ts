import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoggerService } from './logger/logger.service'
import { EmailService } from './email/email.service'
import { LedgerConnector } from './ledger-connector/ledger-connector-file-system.service'
import { EthereumLedgerConnector } from './ledger-connector/ledger-connector-ethereum'
import { GithubIntegrationService } from './github-integration/github-integration.service'
import { SupportNotifierService } from './support-notifier/support-notifier.service'
import { AuthenticationMiddleware } from './authentication/authentication.middleware'
import { AuthenticationService } from './authentication/authentication.service'
import { AuthenticationController } from './authentication/authentication.controller'
import { IConfig } from './interfaces'
import { UptimeService } from './uptime/uptime.service'
import { PersistencyService } from './persistency/persistency.service'
import * as path from 'path'
import * as fs from 'fs-sync'
import { AuthenticationServiceDouble } from './authentication/authentication.service.double'

export const config: IConfig = fs.readJSON(path.join(__dirname, '../.env.json'))

function getLedgerConnector() {
  switch (config.ledgerConnector) {
    case 'LedgerConnector': return LedgerConnector
    case 'EthereumLedgerConnector': return EthereumLedgerConnector
    default: return LedgerConnector
  }
}

function getAuthenticationService() {
  switch (config.authenticationService) {
    case 'AuthenticationService': return AuthenticationService
    case 'AuthenticationServiceDouble': return AuthenticationServiceDouble
    default: return AuthenticationService
  }
}

const ledgerConnectorProvider = {
  provide: 'LedgerConnector',
  useClass: getLedgerConnector(),
}

const authenticationServiceProvider = {
  provide: 'AuthenticationService',
  useClass: getAuthenticationService(),
}
@Module({
  imports: [],
  controllers: [AppController, AuthenticationController],
  providers: [
    AppService,
    LoggerService,
    EmailService,
    ledgerConnectorProvider,
    authenticationServiceProvider,
    GithubIntegrationService,
    SupportNotifierService,
    UptimeService,
    PersistencyService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude('')
      // .forRoutes({ path: '*', method: RequestMethod.ALL })
      // .forRoutes({ path: lettersRegexp, method: RequestMethod.ALL })
      .forRoutes({ path: 'post*', method: RequestMethod.ALL }, { path: 'get*', method: RequestMethod.ALL })
  }
}

    // const lettersRegexp = /^[A-Za-z]+$/
    // console.log(lettersRegexp.test('getUser')
