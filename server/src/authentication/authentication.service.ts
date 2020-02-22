import { Injectable } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import { IAuthenticationData } from '../interfaces'
import { ELogLevel } from '../logger/logger-interface'
import * as uuidv1 from 'uuid/v1'
import { config } from '../app.module'
import { GithubIntegrationService } from '../github-integration/github-integration.service'
import { PersistencyService } from '../persistency/persistency.service'
const axios = require('axios')

@Injectable()
export class AuthenticationService {
    private actionsForRedirectingConvenientlyAfterLogin = []
    private validStates: string[] = []

    public constructor(private readonly lg: LoggerService, private readonly gitHubIntegration: GithubIntegrationService, private readonly persistencyService: PersistencyService) {
        setInterval(() => {
            this.actionsForRedirectingConvenientlyAfterLogin = [] // initializing after 11 days
            this.validStates = []
        }, 11 * 24 * 60 * 60 * 1000)
    }

    public isUserAuthenticated(michaelsfriendskey: string): boolean {
        const authenticationData: IAuthenticationData = this.getAuthenticationDataFromMainMemory(michaelsfriendskey)

        if (authenticationData === undefined) { return false }
        if (authenticationData.login === '') { return false }

        return true
    }

    public getAuthenticationDataFromMainMemory(userAccessToken: string): IAuthenticationData {
        const allAuthenticationData = this.persistencyService.getAuthenticationData()
        this.lg.log(ELogLevel.Info, `checking for token: ${userAccessToken} within ${JSON.stringify(allAuthenticationData)}`)
        return allAuthenticationData.filter((aD: IAuthenticationData) => aD.token === userAccessToken)[0]
    }

    async createAuthenticationDataFromCode(code: any, state: any): Promise<IAuthenticationData> {
        const newToken = await this.getTokenFromCode(code, state)
        const authenticationData = await this.handleNewToken(newToken)

        return authenticationData
    }

    public addState(): string {
        const state = uuidv1().replace(/-/g, '')
        this.validStates.push(state)
        return state
    }

    public getOAUTHLoginURL(state: string): string {
        // return `${config.gitHubURL}/login/oauth/authorize?client_id=${config.gitHubOAuthClient}&scope=read:user&state=${state}`
        return `${config.oAuthProviderURL}/login/oauth/authorize?client_id=${config.gitHubOAuthClient}&scope=read:user&state=${state}`
    }

    public getActionForAddress(remoteAddress: any): any {
        const entry = this.actionsForRedirectingConvenientlyAfterLogin.filter((e) => e.ipAddress === remoteAddress)[0]
        this.lg.log(ELogLevel.Info, `getting action ${entry.action} for ${remoteAddress}`)
        const index = this.actionsForRedirectingConvenientlyAfterLogin.indexOf(entry)
        this.lg.log(ELogLevel.Info, `there are: ${this.actionsForRedirectingConvenientlyAfterLogin.length} entries`)
        if (index === -1) {
            return ''
        } else {
            this.lg.log(ELogLevel.Info, `deleting action of IP at index: ${index}`)
            this.actionsForRedirectingConvenientlyAfterLogin.splice(index, 1) // no need to store this any longer
            return entry.action
        }
    }

    public keepTheAction(action: string, ipAddress: string) {
        const addressWantsTo = {
            ipAddress,
            action,
        }
        this.actionsForRedirectingConvenientlyAfterLogin.push(addressWantsTo)
    }

    private getTestAuthenticationData(michaelsfriendskey: any): IAuthenticationData {
        return {
            avatarURL: 'https://avatars1.githubusercontent.com/u/43786652?v=4',
            login: 'michael-spengler',
            token: michaelsfriendskey,
        }
    }

    private async getTokenFromCode(code: string, state: string) {
        if (this.validStates.indexOf(state) === -1) {
            const message = `I guess the state: ${state} is not valid`
            this.lg.log(ELogLevel.Error, message)
            throw new Error(message)
        }
        this.lg.log(ELogLevel.Info, 'Validated state successfully')

        const oauthConfirmationURL =
            `${config.gitHubURL}/login/oauth/access_token?client_id=${config.gitHubOAuthClient}&client_secret=${config.gitHubOAuthSecret}&code=${code}&state=${state}`

        const result = (await axios.get(oauthConfirmationURL)).data
        const accessToken = result.split('access_token=')[1].split('&')[0]

        return accessToken
    }

    private async handleNewToken(michaelsfriendskey: any): Promise<IAuthenticationData> {
        let authenticationData: IAuthenticationData
        this.lg.log(ELogLevel.Info, 'handling new token')
        authenticationData = await this.gitHubIntegration.getAuthenticationDataFromGitHub(michaelsfriendskey)
        this.addAuthenticationData(authenticationData)
        this.lg.log(ELogLevel.Info, `I have created the following Authentication Data: ${JSON.stringify(authenticationData)}`)

        return authenticationData
    }

    private addAuthenticationData(aD: IAuthenticationData): void {
        const allAuthenticationData = this.persistencyService.getAuthenticationData()
        if (allAuthenticationData.filter((entry: IAuthenticationData) => entry.token === aD.token)[0] !== undefined) {
            this.lg.log(ELogLevel.Warning, 'Authentication Data is already in Store')
        } else {
            this.lg.log(ELogLevel.Info, 'Authentication Data added to Store')

            allAuthenticationData.push(aD)
            this.persistencyService.saveAuthenticationData(allAuthenticationData)
        }
    }

}
