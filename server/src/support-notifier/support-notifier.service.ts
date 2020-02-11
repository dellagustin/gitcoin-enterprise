import { Injectable } from '@nestjs/common'
import { config } from '../app.module'
import { ISupportNotifier } from './support-notifier-interface'
const teleBot = require('telebot')

@Injectable()
export class SupportNotifierService implements ISupportNotifier {

    private static started = false
    private static bot

    public static initializeOnlyOnce(): void {
        if (SupportNotifierService.started || config === undefined || config.notifierToken === '') {
            return
        }
        SupportNotifierService.started = true
        SupportNotifierService.bot = new teleBot({ token: config.notifierToken })
        SupportNotifierService.bot.on('text', (msg: any) => {
            // console.log(JSON.stringify(msg))
            msg.reply.text(`Selber ${msg.text}`)
        })
        SupportNotifierService.bot.start()

    }

    public constructor() {
        SupportNotifierService.initializeOnlyOnce()
    }

    public async sendMessageToSupportChannel(message: string): Promise<any> {
        if (config.notifierToken !== '') {
            return SupportNotifierService.bot.sendMessage(config.notifierSupportChannel, message)
        }
    }
}
