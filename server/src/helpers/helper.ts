import moment = require('moment')
import { IInvitationListFromUser } from '../interfaces'

export class Helper {
    public static hasUserAlreadyInvitedThisFriend(invitingUserEMail: string, friendsEMailAddress: string, invitationLists: IInvitationListFromUser[]): any {
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
        }
        return false
    }

    // public static isInvitationAllowed(userId: string, invitationLists: IInvitationListFromUser[]): boolean {
    //     // const lastInvitationOfUser = fs.readJSON(this.fileIdLastInvitation).filter((lastInvitation: IInvitation) => )
    //     const invitationListFromThisUser: IInvitationListFromUser =
    //         invitationLists.filter((invitation: IInvitationListFromUser) => invitation.from === userId)[0]

    //     const invitedFriends: IInvitedFriend[] = (invitationListFromThisUser === undefined) ? [] : invitationListFromThisUser.invitedFriends
    //     const lastInvitation: IInvitedFriend = invitedFriends[invitedFriends.length - 1]
    //     if (lastInvitation === undefined) {
    //         return true
    //     }
    //     const minutes: moment.unitOfTime.DurationConstructor = 'minutes'

    //     return Helper.isItLongerAgoThan(60, minutes, moment(lastInvitation.date))
    // }
}
