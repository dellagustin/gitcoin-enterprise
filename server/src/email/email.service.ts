import { Injectable } from '@nestjs/common'
// import nodemailer = require('nodemailer')
import { IEmail, IInvitedFriend, IInvitationListFromUser } from '../interfaces'
import { LoggerService, ELogLevel } from '../logger/logger.service'
import { config } from '../app.module'
import * as fs from 'fs-sync'
import * as path from 'path'
import moment = require('moment')

@Injectable()
export class EmailService {

    private fileIdInvitationLists = path.join(__dirname, '../../operational-data/invitation-list.json')
    // private fileIdLastInvitation = path.join(__dirname, '../../operational-data/last-invitations.json')

    public constructor(private readonly logger: LoggerService) { }

    public sendEMail(eMail: IEmail): any {
        const invitationLists: IInvitationListFromUser[] = fs.readJSON(this.fileIdInvitationLists)

        if (this.isInvitationAllowed(eMail.sender, invitationLists)) {
            if (config.port === '443') {
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

    private sendEMailViaNodeMailer(eMail: IEmail) {
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

    private isInvitationAllowed(userID: string, invitationLists: IInvitationListFromUser[]): boolean {
        // const lastInvitationOfUser = fs.readJSON(this.fileIdLastInvitation).filter((lastInvitation: IInvitation) => )
        const invitationListFromThisUser: IInvitationListFromUser =
            invitationLists.filter((invitation: IInvitationListFromUser) => invitation.from === userID)[0]

        const invitedFriends: IInvitedFriend[] = (invitationListFromThisUser === undefined) ? [] : invitationListFromThisUser.invitedFriends
        const lastInvitation: IInvitedFriend = invitedFriends[invitedFriends.length - 1]

        if (lastInvitation === undefined) {
            return true
        } else {
            const minutes: moment.unitOfTime.DurationConstructor = 'minutes'

            return this.isItLongerAgoThan(60, minutes, lastInvitation.date)
        }

    }

    private isItLongerAgoThan(value: number, unit: moment.unitOfTime.DurationConstructor, previousMoment: any) {
        if (moment().subtract(value, unit).isAfter(previousMoment)) {
            return true
        } else {
            return false
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
