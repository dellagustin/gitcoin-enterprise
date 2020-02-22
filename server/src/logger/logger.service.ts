import { Injectable } from '@nestjs/common'
import { config } from '../app.module'
import { SupportNotifierService } from '../support-notifier/support-notifier.service'
import { ELogLevel, ILogger } from './logger-interface'
import { PersistencyService } from '../persistency/persistency.service'

@Injectable()
export class LoggerService implements ILogger {

    public logLevel = config.logLevel

    public constructor(public readonly notifierService: SupportNotifierService, private readonly persistencyService: PersistencyService) { }

    public async log(messageType: ELogLevel, message: string): Promise<void> {
        if (this.logLevel >= messageType) {
            // tslint:disable-next-line: no-console
            console.log(message) // the logger is the only one who is allowed to log to the console :)
        }

        if (messageType === ELogLevel.Error || messageType === ELogLevel.Notification) {

            if (this.notifierService !== undefined) {
                await this.notifierService.sendMessageToSupportChannel(message)
            }

        }
    }

}
