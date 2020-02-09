import { Injectable } from '@nestjs/common'
// import nodemailer = require('nodemailer')
import { IEmail, IInvitedFriend, IInvitationListFromUser, IUser } from '../interfaces'
import { LoggerService } from '../logger/logger.service'
import { config } from '../app.module'
import { Helper } from '../helper'
import * as fs from 'fs-sync'
import * as path from 'path'
import moment = require('moment')
import { ELogLevel } from '../logger/logger-interface'
import * as uuidv1 from 'uuid/v1'

@Injectable()
export class EmailService {

    private fileIdInvitationLists = path.join(__dirname, '../../operational-data/invitation-lists.json')
    // private fileIdLastInvitation = path.join(__dirname, '../../operational-data/last-invitations.json')

    public constructor(private readonly lg: LoggerService) { }

    public sendEMail(eMail: IEmail): any {
        const invitationLists: IInvitationListFromUser[] = fs.readJSON(this.fileIdInvitationLists)
        this.lg.log(ELogLevel.Info, `I received an eMail request ${JSON.stringify(eMail)}`)
        if (!this.isUserAllowedToTriggerEMails(eMail.sender)) {
            return {
                success: false,
            }
        }

        if (this.isInvitationAllowed(eMail.sender, invitationLists)) {
            if (config.port === '443' || config.port === '3000') {
                this.sendEMailViaNodeMailer(eMail)
            }
            this.addInvitationToFile(eMail, invitationLists)
            return {
                success: true,
            }
        } else {
            return {
                success: false,
            }
        }
    }

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

        const personalAccessToken = uuidv1().substr(4, 8)

        const mailOptions = {
            from: config.eMail,
            to: eMail.recipient,
            subject: 'Invitation for Peer2Peer Enterprise',
            text: eMail.content.replace('accessToken', personalAccessToken),
            html: this.getHTMLEMail(eMail.sender, eMail.content),
        }

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                throw new Error(error)
            }
            await this.lg.log(ELogLevel.Warning, `Message sent: ${info.response}`)

            return {
                success: true,
            }
        })
    }

    private isInvitationAllowed(userId: string, invitationLists: IInvitationListFromUser[]): boolean {
        // const lastInvitationOfUser = fs.readJSON(this.fileIdLastInvitation).filter((lastInvitation: IInvitation) => )
        const invitationListFromThisUser: IInvitationListFromUser =
            invitationLists.filter((invitation: IInvitationListFromUser) => invitation.from === userId)[0]

        const invitedFriends: IInvitedFriend[] = (invitationListFromThisUser === undefined) ? [] : invitationListFromThisUser.invitedFriends
        const lastInvitation: IInvitedFriend = invitedFriends[invitedFriends.length - 1]
        if (lastInvitation === undefined) {
            return true
        } else {
            const minutes: moment.unitOfTime.DurationConstructor = 'minutes'

            return Helper.isItLongerAgoThan(60, minutes, moment(lastInvitation.date))
        }

    }

    private getHTMLEMail(sender: string, personalAccessToken: string): string {
        const templateHTMLFileId = path.join(__dirname, './email-template.html')
        const templateHTML = fs.read(templateHTMLFileId)
        try {
            return templateHTML
                .replace(/eMail.sender/g, sender)
                .replace(/backendURL/g, config.backendURL)
                .replace(/backendURLShort/g, config.backendURL.split('https:// ')[1])
                .replace(/accessToken/g, personalAccessToken)
        } catch (error) {
            this.lg.log(ELogLevel.Error, `Something seems wrong with the E-Mail HTML: ${templateHTML}`)
        }
    }

    private async isUserAllowedToTriggerEMails(senderId: string): Promise<boolean> {
        const fileId = path.join(__dirname, '../../operational-data/template-users.json')

        const templateUsers: IUser[] = fs.readJSON(fileId)

        if (templateUsers.length === 0) {
            const message = 'No Demo Users in system - something seems strange - No E-Mail :)'
            this.lg.log(ELogLevel.Error, message)
            throw new Error(message)
        }

        const demoUserWithThisId = templateUsers.filter((user: IUser) => user.id === senderId)[0]
        if (demoUserWithThisId === undefined) {
            return true
        } else {
            await this.lg.log(ELogLevel.Info, 'Demo users shall not trigger too many E-Mails - therefore skipping the post comment feature :)')
            return false
        }
    }
}
