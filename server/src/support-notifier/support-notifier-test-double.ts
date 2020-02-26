import { ISupportNotifier } from './support-notifier-interface'
import { resolve } from 'dns'

export class SupportNotifierTestDouble implements ISupportNotifier {

    public sendMessageToSupportChannel(message: string): any {
        setTimeout(() => Promise.resolve(), 7 * 1000)
    }
}
