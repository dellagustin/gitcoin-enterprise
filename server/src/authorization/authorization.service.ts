import { Injectable } from '@nestjs/common'
import * as fs from 'fs-sync'
import * as path from 'path'

@Injectable()
export class AuthorizationService {
    public storeAuthorization(authorization: any) {
        const fileId = path.join(path.resolve(''), '../../operational-data/authorizations.json')
        const authorizations = fs.readJSON(fileId)
        authorizations.push(authorization)
        fs.write(fileId, JSON.stringify(authorizations))
    }
}
