import { Injectable } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import { IAuthenticationData } from '../interfaces'
import { ELogLevel } from '../logger/logger-interface'
import { GithubIntegrationService } from '../github-integration/github-integration.service'
import { PersistencyService } from '../persistency/persistency.service'
import { LedgerConnector } from '../ledger-connector/ledger-connector-file-system.service'
import { AuthenticationService } from './authentication.service'

@Injectable()
export class AuthenticationServiceEnterprise extends AuthenticationService {

    public constructor(lg: LoggerService, gitHubIntegration: GithubIntegrationService, persistencyService: PersistencyService, ledgerConnector: LedgerConnector) {
        super(lg, gitHubIntegration, persistencyService, ledgerConnector)
    }

    protected isUserIDValid(login: string): boolean {
        void this.lg.log(ELogLevel.Info, `validating login: ${login} via index of D or I ${login.indexOf('D')}`)

        return (login.indexOf('D') === 1 || login.indexOf('I') === 1) ? false : true
    }
}
