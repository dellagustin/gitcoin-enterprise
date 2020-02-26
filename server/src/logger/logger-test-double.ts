import { SupportNotifierService } from '../support-notifier/support-notifier.service'
import { ELogLevel, ILogger } from './logger-interface'
import { config } from '../app.module'

export class LoggerDouble implements ILogger {

    public logLevel = config.logLevel
    public readonly notifierService: SupportNotifierService
    public log(messageType: ELogLevel, message: string): any {
        setTimeout(() => Promise.resolve(), 7 * 1000)
    }
}
