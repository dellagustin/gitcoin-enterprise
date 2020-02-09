import { ISupportNotifier } from './support-notifier-interface'

export class SupportNotifierTestDouble implements ISupportNotifier {

    public async sendMessageToSupportChannel(message: string): Promise<any> {
        setTimeout(() => {
            // I just take a nap in hear :) after reading http://xunitpatterns.com/Test%20Double.html
        }, 7 * 1000)
    }
}
