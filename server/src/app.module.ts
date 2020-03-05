import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { GithubIntegrationService } from './github-integration/github-integration.service'
import { SupportNotifierService } from './support-notifier/support-notifier.service'
import { AuthenticationMiddleware } from './authentication/authentication.middleware'
import { AuthenticationService } from './authentication/authentication.service'
import { AuthenticationController } from './authentication/authentication.controller'
import { IConfig } from './interfaces'
import { UptimeService } from './uptime/uptime.service'
import { PersistencyService } from './persistency/persistency.service'
import { AuthenticationServiceDouble } from './authentication/authentication.service.double'
import { ImagesController } from './images/images.controller'
import { ImagesService } from './images/images.service'
import { Neo4jService } from './neo4j/neo4j.service'
import { PostgresService } from './persistency/postgres.service'
import * as path from 'path'
import * as fs from 'fs-sync'
import { LoggerService } from './logger/logger.service'

export const config: IConfig = fs.readJSON(path.join(__dirname, '../.env.json'))

function getPersistencyService() {
  switch (config.persistencyService) {
    case 'PersistencyService': return PersistencyService
    case 'PostgresService': return PostgresService
    default: return PersistencyService
  }
}

function getAuthenticationService() {
  switch (config.authenticationService) {
    case 'AuthenticationService': return AuthenticationService
    case 'AuthenticationServiceDouble': return AuthenticationServiceDouble
    default: return AuthenticationService
  }
}

const persistencyServiceProvider = {
  provide: 'PersistencyService',
  useClass: getPersistencyService(),
}

const authenticationServiceProvider = {
  provide: 'AuthenticationService',
  useClass: getAuthenticationService(),
}
@Module({
  imports: [],
  controllers: [AppController, AuthenticationController, ImagesController],
  providers: [
    AppService,
    LoggerService,
    authenticationServiceProvider,
    GithubIntegrationService,
    SupportNotifierService,
    UptimeService,
    persistencyServiceProvider,
    ImagesService,
    Neo4jService,
    PostgresService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
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
