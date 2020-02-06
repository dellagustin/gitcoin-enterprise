import { Injectable } from '@nestjs/common'
import nodemailer = require('nodemailer')
import { IEmail } from '../interfaces'
import { LoggerService, ELogLevel } from '../logger/logger.service'

@Injectable()
export class EmailService {

    public constructor(private readonly logger: LoggerService) { }
    public async sendEMail(eMail: IEmail): Promise<any> {

        // async..await is not allowed in global scope, must use a wrapper

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        const testAccount = await nodemailer.createTestAccount()

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        })

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: eMail.sender,
            to: eMail.recipient,
            subject: eMail.subject,
            text: eMail.content,
            html: this.getHTMLEMail(eMail.sender, eMail.content),
        })

        this.logger.log(ELogLevel.Warning, `Message sent: ${info.messageId}`)
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        this.logger.log(ELogLevel.Warning, `Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    getHTMLEMail(sender: string, content: string): string {
        // tslint:disable-next-line: max-line-length
        return '<div>Hi.<p><br></p><p><br></p>Your friend {{{eMail.sender}}} invited you to join gitcoin-enterprise.org.<br>Your personal access link is<a href="https://gitcoin-enterprise.org?id={{{accessToken}}}">https://gitcoin-enterprise.org?id=65ea6dc0-4938-11ea-b60c-1719c00abb24</a>.   <p><br></p>We just mined 2000 EIC for you. Use them wisely :)<p><br></p><p><br></p></p></div>'
            .replace('{{{eMail.sender}}}', sender)
            .replace('{{{accessToken}}}', content.split('https://gitcoin-enterprise.org?id=')[1].split('"')[0])
    }

}
