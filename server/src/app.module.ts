import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoggerService } from './logger/logger.service'
import { EmailService } from './email/email.service'
import { LedgerConnector } from './ledger-connector/ledger-connector-file-system.service'
import { EthereumLedgerConnector } from './ledger-connector/ledger-connector-ethereum'
import { GithubIntegrationService } from './github-integration/github-integration.service'
import { SupportNotifierService } from './support-notifier/support-notifier.service'
import { AuthorizationService } from './authorization/authorization.service'
import * as path from 'path'
import * as fs from 'fs-sync'

export const config = fs.readJSON(path.join(__dirname, '../.env.json'))

function getLedgerConnector() {
  switch (config.ledgerConnector) {
    case 'LedgerConnector': return LedgerConnector
    case 'EthereumLedgerConnector': return EthereumLedgerConnector
    default: return LedgerConnector
  }
}

const ledgerConnectorProvider = {
  provide: 'LedgerConnector',
  useClass: getLedgerConnector(),
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, LoggerService, EmailService, ledgerConnectorProvider, GithubIntegrationService, SupportNotifierService, AuthorizationService],
})
export class AppModule { }
