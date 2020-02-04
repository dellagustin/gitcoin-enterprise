import { Injectable } from '@nestjs/common'
import * as fs from 'fs-sync'
import * as path from 'path'
import { config } from '../gitcoin-enterprise-server'

export enum ELogLevel {
    Error = 1,
    Warning = 2,
    Info = 3,
}
@Injectable()
export class LoggerService {

    private static currentPath = path.resolve(path.dirname(''))
    public static errorsFileID = path.join(LoggerService.currentPath, 'errors', 'errors.json')

    private logLevel = config.logLevel

    public log(messageType: ELogLevel, message: string) {
        if (this.logLevel >= messageType) {
            // tslint:disable-next-line: no-console
            console.log(message) // the logger is the only one who is allowed to log to the console :)
        }

        if (messageType === ELogLevel.Error) {
            this.addErrorToFile(message)
        }
    }

    private addErrorToFile(message: string) {
        const errorFileContent = fs.readJSON(LoggerService.errorsFileID)
        errorFileContent.push({ message })
        fs.write(LoggerService.errorsFileID, JSON.stringify(errorFileContent))
    }
}
