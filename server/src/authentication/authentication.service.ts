import { Injectable } from '@nestjs/common'
import { LoggerService } from '../logger/logger.service'
import { IAuthenticationData } from '../interfaces'
import { ELogLevel } from '../logger/logger-interface'
import * as uuidv1 from 'uuid/v1'
import { config } from '../app.module'
import * as httpRequest from 'request'
import { GithubIntegrationService } from '../github-integration/github-integration.service'
import { PersistencyService } from '../persistency/persistency.service'
const axios = require('axios')

@Injectable()
export class AuthenticationService {

    private static authenticationData: IAuthenticationData[] = []
    private actionsForRedirectingConvenientlyAfterLogin = []
    private validStates: string[] = []

    public constructor(private readonly lg: LoggerService, private readonly gitHubIntegration: GithubIntegrationService, private readonly persistencyService: PersistencyService) {
        setInterval(() => {
            this.actionsForRedirectingConvenientlyAfterLogin = [] // initializing after 11 days
            this.validStates = []
        }, 11 * 24 * 60 * 60 * 1000)
        if (config.testMode) {
            this.handleNewToken('4711')
        }
    }

    public getAuthenticationDataFromMainMemory(userAccessToken: string): IAuthenticationData {
        this.lg.log(ELogLevel.Info, `checking for token: ${userAccessToken} within ${JSON.stringify(AuthenticationService.authenticationData)}`)
        return AuthenticationService.authenticationData.filter((aD: IAuthenticationData) => aD.token === userAccessToken)[0]
    }

    public addAuthenticationData(aD: IAuthenticationData): void {
        if (AuthenticationService.authenticationData.filter((entry: IAuthenticationData) => entry.token === aD.token)[0] !== undefined) {
            this.lg.log(ELogLevel.Warning, 'Token is already in RAM')
        } else {
            AuthenticationService.authenticationData.push(aD)
            const authenticationData = this.persistencyService.getAuthenticationData()
            authenticationData.push(aD)
            this.persistencyService.saveAuthenticationData(authenticationData)
        }
    }

    public getOAUTHLoginURL(): string {
        const state = uuidv1().replace(/-/g, '')
        this.validStates.push(state)
        return `${config.gitHubURL}/login/oauth/authorize?client_id=${config.gitHubOAuthClient}&scope=read:user&state=${state}`
    }

    public async handleGitHubCallback(code: string, state: string) {
        if (this.validStates.indexOf(state) === -1) {
            const message = `I guess the state: ${state} is not valid`
            this.lg.log(ELogLevel.Error, message)
            throw new Error(message)
        }
        this.lg.log(ELogLevel.Info, 'Validated state successfully')

        const oauthConfirmationURL =
            `${config.gitHubURL}/login/oauth/access_token?client_id=${config.gitHubOAuthClient}&client_secret=${config.gitHubOAuthSecret}&code=${code}&state=${state}`

        const result = (await axios.get(oauthConfirmationURL)).data

        this.lg.log(ELogLevel.Info, JSON.stringify(result))

        return result.access_token
        // httpRequest({
        //     json: true,
        //     method: 'POST',
        //     url: oauthConfirmationURL,
        // }, (confirmationErr, confirmationRes, confirmationBody) => {
        //     this.lg.log(ELogLevel.Info, `received a new token: ${confirmationBody.access_token}`)
        //     // httpRequest({
        //     //     json: true,
        //     //     method: 'GET',
        //     //     url: `${config.gitHubURL}/api/v3/user?access_token=${confirmationBody.access_token}`,
        //     // }, async (userErr, userRes, userBody) => {
        //     // })
        // })
    }

    async handleNewToken(michaelsfriendskey: any) {
        let authenticationData: IAuthenticationData
        this.lg.log(ELogLevel.Info, 'handling new token')
        if (config.testMode) {
            authenticationData = this.getTestAuthenticationData(michaelsfriendskey)
        } else {
            authenticationData = await this.gitHubIntegration.getAuthenticationDataFromGitHub(michaelsfriendskey)
        }
        this.addAuthenticationData(authenticationData)
    }

    public getActionForAddress(remoteAddress: any): any {
        const entry = this.actionsForRedirectingConvenientlyAfterLogin.filter((e) => e.ipAddress === remoteAddress)[0]
        this.lg.log(ELogLevel.Info, `getting action ${entry.action} for ${remoteAddress}`)
        if (entry === undefined) {
            return ''
        } else {
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
}
