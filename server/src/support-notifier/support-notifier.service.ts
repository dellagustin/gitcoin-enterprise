import { Injectable } from '@nestjs/common'
import { config } from '../app.module'
import { ISupportNotifier } from './support-notifier-interface'
const TeleBot = require('telebot')

@Injectable()
export class SupportNotifierService implements ISupportNotifier {

    private static started = false
    private static bot

    public static initializeOnlyOnce() {
        if (this.started || config.notifierToken === '') {
            return
        }
        SupportNotifierService.started = true
        SupportNotifierService.bot = new TeleBot({ token: config.notifierToken })
        SupportNotifierService.bot.on('text', (msg) => {
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
