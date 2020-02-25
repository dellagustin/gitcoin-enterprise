import { Injectable } from '@nestjs/common'
import { IFunding, IssueInfo, IApplication, IAuthenticationData } from '../interfaces'
import { LoggerService } from '../logger/logger.service'
import { config } from '../app.module'
import * as fs from 'fs-sync'
import * as path from 'path'
import * as moment from 'moment'
import { Helper } from '../helpers/helper'
import { ELogLevel } from '../logger/logger-interface'
const uuidv1 = require('uuidv1')
import axios, { AxiosInstance } from 'axios'
import * as tunnel from 'tunnel'

@Injectable()
export class GithubIntegrationService {
    private octokit

    private lastGetIssueRequest = moment()
    private lastPostCommentRequest = moment()
    private agent
    private axiosClient: AxiosInstance

    public constructor(private readonly lg: LoggerService) {
        if (config.gitHubURL === 'https://github.com') {
            this.axiosClient = axios.create({
                baseURL: config.gitHubURL,
                proxy: false,
            })
        } else {
            this.agent = tunnel.httpsOverHttp({
                proxy: {
                    host: config.proxyHostForEnterpriseGitHubInstance,
                    port: config.proxyHostForEnterpriseGitHubInstancePort,
                },
            })
            this.axiosClient = axios.create({
                baseURL: config.gitHubURL,
                httpsAgent: this.agent,
                proxy: false, // to be save regarding autodetection of environment variables...
            })
        }
    }

    public async getAuthenticationDataFromGitHub(token: string): Promise<IAuthenticationData> {
        let user

        try {
            const getURLToGetUser = `${config.gitHubURL}/api/v3/user?access_token=${token}`
            user = (await this.axiosClient.get(getURLToGetUser)).data
            this.lg.log(ELogLevel.Info, JSON.stringify(`user: ${user}`))
            const authenticationData: IAuthenticationData = {
                avatarURL: user.avatar_url,
                login: user.login,
                token: uuidv1().replace(/-/g, '').substr(0, 10),
            }

            return authenticationData

        } catch (error) {
            const errorMessage = `The following error occurred while retrieving Login: ${error.message} for ${token}` // shall be deleted as soon as test is successful
            this.lg.log(ELogLevel.Error, errorMessage)
            throw new Error(errorMessage)
        }
    }

    public async getIssue(org: any, repo: any, issueId: any): Promise<IssueInfo> {

        const seconds: moment.unitOfTime.DurationConstructor = 'seconds'

        if (!Helper.isItLongerAgoThan(2, seconds, this.lastGetIssueRequest)) {
            const errorMessage = '2 getIssue requests within 2 seconds seems unlikely in demo phase - protecting the backends'
            await this.lg.log(ELogLevel.Error, errorMessage)
            throw new Error(errorMessage)
        }

        this.lastGetIssueRequest = moment()
        await this.lg.log(ELogLevel.Info, `getting Issue data for owner: ${org}, repo: ${repo}, issueId: ${issueId}`)
        const issueInfo = {} as IssueInfo
        try {
            const getURLToGetIssueData = `${config.gitHubURL}/api/v3/repos/${org}/${repo}/issues/${issueId}`
            const issueData = (await this.axiosClient.get(getURLToGetIssueData)).data
            this.lg.log(ELogLevel.Info, JSON.stringify(issueData))
            issueInfo.title = issueData.title
            issueInfo.description = issueData.body
        } catch (error) {
            await this.lg.log(ELogLevel.Error, `the github call to get the issue failed ${error}`)
            issueInfo.title = 'Just a demo Title'
            issueInfo.description = 'Just a demo Description'
        }

        return issueInfo
    }

    public async postCommentAboutSuccessfullFunding(linkToIssue: string, funding: IFunding): Promise<void> {

        const seconds: moment.unitOfTime.DurationConstructor = 'seconds'

        if (!Helper.isItLongerAgoThan(2, seconds, this.lastPostCommentRequest)) {
            const errorMessage = '2 postComment requests within 2 seconds seems unlikely in demo phase - protecting the backends'
            await this.lg.log(ELogLevel.Error, errorMessage)
            throw new Error(errorMessage)
        }

        const templateFileId = path.join(__dirname, '../../src/github-integration/comment-on-funding.md')
        const body = fs.read(templateFileId).toString().replace('{{{amount}}}', funding.amount)

        const owner = linkToIssue.split('/')[3]
        const repoName = linkToIssue.split('/')[4]
        const issueNo = linkToIssue.split('/')[6]
        this.lastPostCommentRequest = moment()
        try {
            const uRLToPostComment = `${config.gitHubURL}/api/v3/repos/${owner}/${repoName}/issues/${issueNo}/comments?access_token=${config.gitHubTokenForPostingCommentsAndForGettingIssueData}`
            const postingResult = (await this.axiosClient.post(uRLToPostComment, body))

            this.lg.log(ELogLevel.Info, JSON.stringify(`posting an issue and getting: ${postingResult}`))

        } catch (error) {
            await this.lg.log(ELogLevel.Error, `postCommentAboutSuccessfullFunding the github call to create a comment for  the issue failed ${error}`)

        }

        await this.lg.log(ELogLevel.Info, linkToIssue)
        await this.lg.log(ELogLevel.Info, JSON.stringify(funding))
    }
    public async postCommentAboutSuccessfullTransfer(linkToIssue: string, funding: IFunding): Promise<void> {

        const seconds: moment.unitOfTime.DurationConstructor = 'seconds'

        if (!Helper.isItLongerAgoThan(2, seconds, this.lastPostCommentRequest)) {
            const errorMessage = '2 postComment requests within 2 seconds seems unlikely in demo phase - protecting the backends'
            await this.lg.log(ELogLevel.Error, errorMessage)
            throw new Error(errorMessage)
        }

        const templateFileId = path.join(__dirname, '../../src/github-integration/comment-on-funding.md')
        const body = fs.read(templateFileId).toString().replace('{{{amount}}}', funding.amount)

        const owner = linkToIssue.split('/')[3]
        const repoName = linkToIssue.split('/')[4]
        const issueNo = linkToIssue.split('/')[6]
        this.lastPostCommentRequest = moment()
        try {
            const uRLToPostComment = `${config.gitHubURL}/api/v3/repos/${owner}/${repoName}/issues/${issueNo}/comments?access_token=${config.gitHubTokenForPostingCommentsAndForGettingIssueData}`
            const postingResult = (await this.axiosClient.post(uRLToPostComment, body))

            this.lg.log(ELogLevel.Info, JSON.stringify(`posting an issue and getting: ${postingResult}`))

        } catch (error) {
            await this.lg.log(ELogLevel.Error, `postCommentAboutSuccessfullTransfer the github call to create a comment for  the issue failed ${error}`)

        }

        await this.lg.log(ELogLevel.Info, linkToIssue)
        await this.lg.log(ELogLevel.Info, JSON.stringify(funding))
    }

    public async postCommentAboutApplication(application: IApplication): Promise<void> {

        const seconds: moment.unitOfTime.DurationConstructor = 'seconds'

        if (!Helper.isItLongerAgoThan(2, seconds, this.lastPostCommentRequest)) {
            const errorMessage = '2 postComment requests within 2 seconds seems unlikely in demo phase - protecting the backends'
            await this.lg.log(ELogLevel.Error, errorMessage)
            throw new Error(errorMessage)
        }

        const templateFileId = path.join(__dirname, '../../src/github-integration/comment-on-application.md')
        const body = fs.read(templateFileId).toString().replace('{{{applicant}}}', application.profileLink).replace('{{{plan}}}', application.plan)

        const owner = application.taskLink.split('/')[3]
        const repoName = application.taskLink.split('/')[4]
        const issueNo = application.taskLink.split('/')[6]
        try {
            const uRLToPostComment = `${config.gitHubURL}/api/v3/repos/${owner}/${repoName}/issues/${issueNo}/comments?access_token=${config.gitHubTokenForPostingCommentsAndForGettingIssueData}`
            const postingResult = (await this.axiosClient.post(uRLToPostComment, body))

            this.lg.log(ELogLevel.Info, JSON.stringify(`posting an issue and getting: ${postingResult}`))

        } catch (error) {
            await this.lg.log(ELogLevel.Error, `postCommentAboutApplication the github call to create a comment for  the issue failed ${error}`)

        }
        await this.lg.log(ELogLevel.Info, application.profileLink)
        await this.lg.log(ELogLevel.Info, application.taskLink)
    }

}
