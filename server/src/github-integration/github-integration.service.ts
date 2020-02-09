import { Injectable } from '@nestjs/common'
import { IFunding, IssueInfo, IUser } from '../interfaces'
import { LoggerService } from '../logger/logger.service'
import { config } from '../app.module'
import * as fs from 'fs-sync'
import * as path from 'path'
import * as moment from 'moment'
import { Helper } from '../helper'
import { ELogLevel } from '../logger/logger-interface'

const { Octokit } = require('@octokit/rest')

@Injectable()
export class GithubIntegrationService {
    private octokit = new Octokit({
        auth: config.token,
    })

    private lastGetIssueRequest = moment()
    private lastPostCommentRequest = moment()

    public constructor(private readonly lg: LoggerService) { }

    public async getIssue(org: any, repo: any, issueId: any): Promise<IssueInfo> {

        const seconds: moment.unitOfTime.DurationConstructor = 'seconds'

        if (!Helper.isItLongerAgoThan(2, seconds, this.lastGetIssueRequest)) {
            const errorMessage = '2 getIssue requests within 2 seconds seems unlikely in demo phase - protecting the backends'
            await this.lg.log(ELogLevel.Error, errorMessage)
            throw new Error(errorMessage)
        }

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

        if (!this.isUserAllowedToTriggerComments(funding.funderId)) {
            return
        }

        const templateFileId = path.join(__dirname, './comment-on-funding.md')
        const body = fs.read(templateFileId).toString().replace('{{{amount}}}', funding.amount)

        const owner = linkToIssue.split('/')[3]
        const repoName = linkToIssue.split('/')[4]
        const issueNo = linkToIssue.split('/')[6]

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

        await this.lg.log(ELogLevel.Info, linkToIssue)
        await this.lg.log(ELogLevel.Info, JSON.stringify(funding))
    }

    public async postCommentAboutApplication(profileLink: string, taskLink: string, plan: string) {

        const seconds: moment.unitOfTime.DurationConstructor = 'seconds'

        if (!Helper.isItLongerAgoThan(2, seconds, this.lastPostCommentRequest)) {
            const errorMessage = '2 postComment requests within 2 seconds seems unlikely in demo phase - protecting the backends'
            await this.lg.log(ELogLevel.Error, errorMessage)
            throw new Error(errorMessage)
        }
        if (!this.isUserAllowedToTriggerComments('tbd')) {
            return
        }

        const templateFileId = path.join(__dirname, './comment-on-application.md')
        const body = fs.read(templateFileId).toString().replace('{{{applicant}}}', profileLink).replace('{{{plan}}}', plan)

        const owner = taskLink.split('/')[3]
        const repoName = taskLink.split('/')[4]
        const issueNo = taskLink.split('/')[6]
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
        await this.lg.log(ELogLevel.Info, profileLink)
        await this.lg.log(ELogLevel.Info, taskLink)
    }

    private async isUserAllowedToTriggerComments(funderId: string): Promise<boolean> {
        const fileId = path.join(__dirname, '../../operational-data/template-users.json')

        const users: IUser[] = fs.readJSON(fileId)

        if (users.length === 0) {
            throw new Error('No Users - No Comment :)')
        }

        const demoUserWithThisId = users.filter((user: IUser) => user.id === funderId)[0]
        if (demoUserWithThisId === undefined) {
            return true
        } else {
            await this.lg.log(ELogLevel.Info, 'Demo users shall not trigger too many comments - therefore skipping the post comment feature :)')
            return false
        }
    }
}
