import { Injectable } from '@nestjs/common'
import * as fs from 'fs-sync'
import * as path from 'path'
import { IUser } from '../interfaces'

@Injectable()
export class AuthorizationService {
    public storeAuthorization(authorization: any, sessionWithoutCookie: string): void {
        const fileId = path.join(path.resolve(''), './operational-data/authorizations.json')
        const authorizations = fs.readJSON(fileId)
        authorizations.push(authorization)
        fs.write(fileId, JSON.stringify(authorizations))

        this.enrichProfileLink(authorization, sessionWithoutCookie)
    }

    public enrichProfileLink(authorization: any, sessionWithoutCookie: string) {
        const fileId = path.join(path.resolve(''), '../../operational-data/users.json')
        const users = fs.readJSON(fileId)
        const currentUser = users.filter((user: IUser) => user.id === sessionWithoutCookie)[0]
        if (currentUser === undefined) {
            throw new Error('Error in enrichProfileLink')
        }

        const index = users.indexOf(currentUser)
        users.spice(index, 1)
        currentUser.link = authorization.link

        users.push(currentUser)
        fs.write(fileId, JSON.stringify(users))

    }
}
