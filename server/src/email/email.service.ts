import { Injectable } from '@nestjs/common'
// import nodemailer = require('nodemailer')
import { IEmail, IInvitation } from '../interfaces'
import { LoggerService, ELogLevel } from '../logger/logger.service'
import { config } from '../app.module'
import * as fs from 'fs-sync'
import * as path from 'path'
import moment = require('moment')

@Injectable()
export class EmailService {

    private fileIdInvitations = path.join(__dirname, '../../operational-data/invitations.json')

    public constructor(private readonly logger: LoggerService) { }

    public sendEMail(eMail: IEmail): any {
        if (!this.isInvitationAllowed(eMail.sender)) {
            return {
                success: false,
            }
        }
        const nodemailer = require('nodemailer')

        const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: 587,
            secure: false, // true for 465, false for other ports like 587
            auth: {
                user: config.eMail,
                pass: config.pw,
            },
        })

        const mailOptions = {
            from: config.eMail,
            to: eMail.recipient,
            subject: 'Invitation for Peer2Peer Enterprise',
            text: eMail.content,
            html: this.getHTMLEMail(eMail.sender, eMail.content),
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new Error(error)
            }
            this.logger.log(ELogLevel.Warning, `Message sent: ${info.response}`)

            return {
                success: true,
            }
        })
    }

    private isInvitationAllowed(userID: string) {
        const invitationsFromThisUserToday = fs.readJSON(this.fileIdInvitations).filter((invitation: IInvitation) => {
            if (invitation.from === userID) {
                return true
            } else {
                return false
            }
        })

        if (invitationsFromThisUserToday.length > config.invitationsPerUserPerDay) {
            return false // wait some more days to do it right :)
        } else {
            return true
        }
    }

    private getHTMLEMail(sender: string, content: string): string {
        const templateHTMLFileId = path.join(__dirname, './email-template.html')
        return fs.read(templateHTMLFileId)
            .replace(/eMail.sender/g, sender)
            .replace(/backendURL/g, config.backendURL)
            .replace(/backendURLShort/g, config.backendURL.split('https:// ')[1])
            .replace(/accessToken/g, content.split(`${config.backendURL}?id=`)[1].split('"')[0])
    }

}
