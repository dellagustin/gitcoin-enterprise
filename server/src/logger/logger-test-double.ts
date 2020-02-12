import { SupportNotifierService } from '../support-notifier/support-notifier.service'
import { ELogLevel, ILogger } from './logger-interface'
import { config } from '../app.module'

export class LoggerDouble implements ILogger {

    public logLevel = config.logLevel
    public readonly notifierService: SupportNotifierService

    constructor() {
        //
    }

    public async log(messageType: ELogLevel, message: string): Promise<void> {
        setTimeout(() => {
            // I just take a nap in hear :) after reading http://xunitpatterns.com/Test%20Double.html
            return Promise.resolve()
        }, 7 * 1000)
    }
}
