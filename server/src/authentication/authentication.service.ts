import { Injectable } from '@nestjs/common'
import * as fs from 'fs-sync'
import * as path from 'path'
import { IUser } from '../interfaces'
import { ELogLevel } from '../logger/logger-interface'
import { LoggerService } from '../logger/logger.service'
import { GithubIntegrationService } from '../github-integration/github-integration.service'

@Injectable()
export class AuthenticationService {

    private fileIdUsers = path.join(path.resolve(''), './operational-data/users.json')
    private fileIdAuthorization = path.join(path.resolve(''), './operational-data/authorizations.json')

    public constructor(private readonly lg: LoggerService, private readonly gh: GithubIntegrationService) { }

    public storeAuthorization(authorization: any, sessionWithoutCookie: string): void {
        this.lg.log(ELogLevel.Info, `Storing the following Authorization: ${JSON.stringify(authorization)}`)
        const authorizations = fs.readJSON(this.fileIdAuthorization)
        authorizations.push(authorization)
        fs.write(this.fileIdAuthorization, JSON.stringify(authorizations))

        this.enrichProfileLink(authorization, sessionWithoutCookie)
    }

    public enrichProfileLink(authorization: any, sessionWithoutCookie: string) {
        this.lg.log(ELogLevel.Info, 'We probably have to fetch the user profile name here')
        this.gh.getProfileInfo(authorization.token)
        const users = fs.readJSON(this.fileIdUsers)
        const currentUser = users.filter((user: IUser) => user.id === sessionWithoutCookie)[0]
        if (currentUser === undefined) {
            const message = 'Error in enrichProfileLink'
            this.lg.log(ELogLevel.Error, message)
            throw new Error(message)
        }

        const index = users.indexOf(currentUser)
        users.spice(index, 1)
        currentUser.link = authorization.link

        users.push(currentUser)
        fs.write(this.fileIdUsers, JSON.stringify(users))

    }

    public isUserAuthenticated(userId: string): boolean {
        this.lg.log(ELogLevel.Info, `checking if user ${userId} is authenticated by checking if there is a profile link`)
        const users = fs.readJSON(this.fileIdUsers)
        const currentUser: IUser = users.filter((user: IUser) => user.id === userId)[0]
        if (currentUser === undefined || currentUser.link === '') {
            this.lg.log(ELogLevel.Info, `user ${userId} is not authenticated ${currentUser}`)
            return false
        }

        return true
    }

}
