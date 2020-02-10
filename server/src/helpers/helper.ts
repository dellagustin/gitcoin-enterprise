import moment = require('moment')
import { IUser, IInvitationListFromUser, IInvitedFriend } from '../interfaces'
import * as fs from 'fs-sync'
import * as path from 'path'

export class Helper {
    static hasUserAlreadyInvitedThisFriend(invitingUserEMail: string, friendsEMailAddress: string, invitationLists: IInvitationListFromUser[]): any {
        const invitationListFromThisUser: IInvitationListFromUser =
            invitationLists.filter((invitation: IInvitationListFromUser) => invitation.from === invitingUserEMail)[0]

        if (invitationListFromThisUser === undefined) {
            return false
        }

        for (const invitedFriend of invitationListFromThisUser.invitedFriends) {
            if (invitedFriend.eMail === friendsEMailAddress) {
                return true
            }
        }

        return false
    }

    public static isItLongerAgoThan(value: number, unit: moment.unitOfTime.DurationConstructor, previousMoment: any) {
        if (moment().subtract(value, unit).isAfter(previousMoment)) {
            return true
        } else {
            return false
        }
    }

    public static doesUserExist(userId: string) {
        const fileId = path.join(__dirname, '../../operational-data/users.json')

        const users: IUser[] = fs.readJSON(fileId)

        const userWithThisId = users.filter((user: IUser) => user.id === userId)[0]
        if (userWithThisId !== undefined) {
            return true
        } else {
            return false
        }
    }

    public static isInvitationAllowed(userId: string, invitationLists: IInvitationListFromUser[]): boolean {
        if (!Helper.doesUserExist(userId)) {
            return false
        }

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
}
