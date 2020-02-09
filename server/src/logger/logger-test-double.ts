import { ELogLevel } from './logger-interface'

export class LoggerDouble {
    constructor() {
        //
    }

    public async log(messageType: ELogLevel, message: string): Promise<void> {
        setTimeout(() => {
            // I just take a nap in hear :) after reading http://xunitpatterns.com/Test%20Double.html
        }, 7 * 1000)
    }
}
