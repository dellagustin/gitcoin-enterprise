import { Injectable } from '@nestjs/common'
import * as fs from 'fs-sync'
import * as path from 'path'
import { config } from '../app.module'
import { SupportNotifierService } from '../support-notifier/support-notifier.service'
import { ELogLevel, ILogger } from './logger-interface'

@Injectable()
export class LoggerService implements ILogger {

    private static readonly currentPath = path.resolve(path.dirname(''))
    private static readonly errorsFileID = path.join(LoggerService.currentPath, 'errors', 'errors.json')

    public logLevel = config.logLevel

    public constructor(public readonly notifierService: SupportNotifierService) { }
    public async log(messageType: ELogLevel, message: string): Promise<void> {
        if (this.logLevel >= messageType) {
            // tslint:disable-next-line: no-console
            console.log(message) // the logger is the only one who is allowed to log to the console :)
        }

        if (messageType === ELogLevel.Error) {

            const errorFileContent = fs.readJSON(LoggerService.errorsFileID)
            errorFileContent.push({ message })
            fs.write(LoggerService.errorsFileID, JSON.stringify(errorFileContent))

            if (this.notifierService !== undefined) {
                await this.notifierService.sendMessageToSupportChannel(message)
            }
        }
    }

}
