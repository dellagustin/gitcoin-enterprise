import { Injectable } from '@nestjs/common'
// import nodemailer = require('nodemailer')
import { IEmail, IInvitedFriend, IInvitationListFromUser } from '../interfaces'
import { LoggerService } from '../logger/logger.service'
import { config } from '../app.module'
import { Helper } from '../helpers/helper'
import * as fs from 'fs-sync'
import * as path from 'path'
import moment = require('moment')
import { ELogLevel } from '../logger/logger-interface'
import * as uuidv1 from 'uuid/v1'

@Injectable()
export class EmailService {

    private readonly fileIdInvitationLists = path.join(__dirname, '../../operational-data/invitation-lists.json')
    // private fileIdLastInvitation = path.join(__dirname, '../../operational-data/last-invitations.json')

    public constructor(private readonly lg: LoggerService) { }

    // public async sendEMail(eMail: IEmail): Promise<any> {
    //     const invitationLists: IInvitationListFromUser[] = fs.readJSON(this.fileIdInvitationLists)
    //     this.lg.log(ELogLevel.Info, `I received an eMail request ${JSON.stringify(eMail)}`)

    //     if (Helper.hasUserAlreadyInvitedThisFriend(eMail.sender, eMail.recipient, invitationLists)) {
    //         return {
    //             success: false,
    //         }
    //     }

    //     if (Helper.isInvitationAllowed(eMail.senderUserId, invitationLists)) {
    //         if (config.port === '443') {
    //             await this.sendEMailViaNodeMailer(eMail)
    //         }
    //         this.addInvitationToFile(eMail, invitationLists)

    //         return {
    //             success: true,
    //         }
    //     } else {
    //         return {
    //             success: false,
    //         }
    //     }
    // }

    public initializeData() {
        fs.write(this.fileIdInvitationLists, '[]')
    }

    private addInvitationToFile(eMail: IEmail, invitationLists: IInvitationListFromUser[]) {
        let invitationListFromUser: IInvitationListFromUser =
            invitationLists.filter((entry: IInvitationListFromUser) => entry.from === eMail.sender)[0]

        if (invitationListFromUser === undefined) {
            invitationListFromUser = {
                from: eMail.sender,
                invitedFriends: [],
            }
        }

        const invitedFriendsFromUser: IInvitedFriend[] = invitationListFromUser.invitedFriends

        const invitedFriend: IInvitedFriend = {
            eMail: eMail.recipient,
            date: moment().toString(),
        }

        invitedFriendsFromUser.push(invitedFriend)
        invitationLists.splice(invitationLists.indexOf(invitationListFromUser), 1)

        invitationListFromUser.invitedFriends = invitedFriendsFromUser

        invitationLists.push(invitationListFromUser)

        fs.write(this.fileIdInvitationLists, JSON.stringify(invitationLists))

    }

    private async sendEMailViaNodeMailer(eMail: IEmail): Promise<void> {
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

        const personalAccessToken = uuidv1().substr(11, 5)

        const mailOptions = {
            from: config.eMail,
            to: eMail.recipient,
            subject: 'Invitation for Peer2Peer Enterprise',
            text: eMail.content.replace('accessToken', personalAccessToken),
            html: this.getHTMLEMail(eMail.sender, personalAccessToken),
        }

        transporter.sendMail(mailOptions, async (error: any, info: any) => {
            if (error) {
                throw new Error(error)
            }
            await this.lg.log(ELogLevel.Warning, `Message sent: ${info.response}`)

            return {
                success: true,
            }
        })
    }

    private async getHTMLEMail(sender: string, personalAccessToken: string): Promise<string> {
        const templateHTMLFileId: string = path.join(__dirname, './email-template.html')
        const templateHTML = fs.read(templateHTMLFileId)
        try {
            return templateHTML
                .replace(/eMail.sender/g, sender)
                .replace(/backendURL/g, config.backendURL)
                .replace(/backendURLShort/g, config.backendURL.split('https:// ')[1])
                .replace(/accessToken/g, personalAccessToken)
        } catch (error) {
            await this.lg.log(ELogLevel.Error, `Something seems wrong with the E-Mail HTML: ${templateHTML}`)
        }
    }

}
