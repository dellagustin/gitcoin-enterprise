import { ELogLevel } from './logger-interface'
import { SupportNotifierService } from '../support-notifier/support-notifier.service'

export class LoggerDouble {
    constructor(private readonly notifierService: SupportNotifierService) {
        //
    }

    public async log(messageType: ELogLevel, message: string): Promise<void> {
        setTimeout(() => {
            // I just take a nap in hear :) after reading http://xunitpatterns.com/Test%20Double.html
        }, 7 * 1000)
    }
}
