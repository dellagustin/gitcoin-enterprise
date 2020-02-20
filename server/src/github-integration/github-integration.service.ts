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

const { Octokit } = require('@octokit/rest')

@Injectable()
export class GithubIntegrationService {
    private octokit

    private lastGetIssueRequest = moment()
    private lastPostCommentRequest = moment()

    public constructor(private readonly lg: LoggerService) {
        // this.lg.log(ELogLevel.Info, config.testMode.toString())
        this.octokit = new Octokit({
            auth: config.token,
            baseUrl: (config.gitHubAPIBaseURL === undefined) ? 'https://api.github.com' : config.gitHubAPIBaseURL,
        })
    }

    public async getAuthenticationDataFromGitHub(token: string): Promise<IAuthenticationData> {
        const octokitForRetrievingUserData = new Octokit({
            auth: token,
        })

        const user = await octokitForRetrievingUserData.users.getAuthenticated()

        // const balance = this.ledgerConnector.getBalanceOf(user.data.login)

        const authenticationData: IAuthenticationData = {
            avatarURL: user.data.avatar_url,
            login: user.data.login,
            token: uuidv1().replace(/-/g, '').substr(0, 10),
        }

        return authenticationData
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
            const response = await this.octokit.issues.get({
                owner: org,
                repo,
                issue_number: issueId,
            })
            issueInfo.title = response.data.title
            issueInfo.description = response.data.body
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
            await this.octokit.issues.createComment({
                body,
                owner,
                issue_number: issueNo,
                repo: repoName,
            })

        } catch (error) {
            await this.lg.log(ELogLevel.Error, `the github call to create a comment for  the issue failed ${error}`)

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
            await this.octokit.issues.createComment({
                owner,
                repo: repoName,
                issue_number: issueNo,
                body,
            })

        } catch (error) {
            await this.lg.log(ELogLevel.Error, `the github call to create a comment for  the issue failed ${error}`)

        }
        await this.lg.log(ELogLevel.Info, application.profileLink)
        await this.lg.log(ELogLevel.Info, application.taskLink)
    }

}
