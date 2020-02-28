import { Injectable } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import { IAuthenticationData } from '../interfaces'
import { ELogLevel } from '../logger/logger-interface'
import { GithubIntegrationService } from '../github-integration/github-integration.service'
import { PersistencyService } from '../persistency/persistency.service'
import { LedgerConnector } from '../ledger-connector/ledger-connector-file-system.service'
import { AuthenticationService } from './authentication.service'

@Injectable()
export class AuthenticationServiceDouble extends AuthenticationService {

    public constructor(lg: LoggerService, gitHubIntegration: GithubIntegrationService, persistencyService: PersistencyService, ledgerConnector: LedgerConnector) {
        super(lg, gitHubIntegration, persistencyService, ledgerConnector)
    }

    protected async getAuthenticationDataFromGitHub(token: string): Promise<IAuthenticationData> {
        void this.lg.log(ELogLevel.Debug, `getTestAuthenticationData: for ${token}`)

        return {
            avatarURL: 'https://avatars1.githubusercontent.com/u/43786652?v=4',
            login: 'michael-spengler',
            id: '4711',
            token,
        }

    }

    protected async getTokenFromCode(code: string, state: string) {
        void this.lg.log(ELogLevel.Debug, `getTokenFromCode: for code ${code} and state ${state}`)

        return 'justSomeDoubleToken123'
    }
}
