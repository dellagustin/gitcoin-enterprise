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
// import { PersistencyService } from './persistency/persistency.service'
import { PostgresService } from './persistency/postgres.service'
import { AuthenticationServiceDouble } from './authentication/authentication.service.double'
import { ImagesController } from './images/images.controller'
import { ImagesService } from './images/images.service'
import { Neo4jService } from './neo4j/neo4j.service'
import { LoggerService } from './logger/logger.service'
import { DatabaseModule } from './database/database.module'
// import { PhotoModule } from './photo/photo.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { PersistencyService } from './persistency/persistency.service'
// import { LedgerEntriesModule } from './postgres/ledger-entries/ledger-entries.module'
// import { LedgerEntriesService } from './postgres/ledger-entries/ledger-entries.service'
import * as path from 'path'
import * as fs from 'fs-sync'
import { LedgerEntry } from './postgres/ledger-entries/ledger-entry.entity'
import { Connection } from 'typeorm'
import { LedgerEntriesModule } from './postgres/ledger-entries/ledger-entries.module'

export const config: IConfig = fs.readJSON(path.join(__dirname, '../.env.json'))

function getEntityPath() {
  const p = `${__dirname}/**/**/*.entity{.ts,.js}`

  // tslint:disable-next-line: no-console
  console.log(p)

  return p
}

function getPostgresConfig(): any {
  return {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'p2p',
    password: config.postgresPW,
    database: 'p2p',
    // name: 'p2p',
    // entities: [],
    entities: [LedgerEntry],
    synchronize: true,
    autoLoadEntities: true,
  }
}

function getPersistencyService() {
  switch (config.persistencyService) {
    case 'PersistencyService': return PersistencyService
    case 'PostgresService': return PostgresService
    default: return PostgresService
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
  imports: [
    // DatabaseModule,
    LedgerEntriesModule,
    TypeOrmModule.forRoot(getPostgresConfig()),
    // TypeOrmModule.forFeature([LedgerEntry], 'p2p'),
  ],
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
  ],
})
export class AppModule {
  public constructor(private readonly connection: Connection) { }
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
