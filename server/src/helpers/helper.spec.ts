import { Test, TestingModule } from '@nestjs/testing'
import { Helper } from './helper'
const fs = require('fs-sync')
const path = require('path')

const fileIdInvitationLists = path.join(
    path.resolve(),
    '../server/operational-data/invitations-lists.json',
)

describe('EmailService', () => {
    let helper: Helper

    beforeEach(async () => {
        helper = new Helper()

    })

    it('should be defined', () => {
        expect(helper).toBeDefined()
    })

    it('should check whether invitation is allowed', () => {
        // expect(Helper.isInvitationAllowed('d123', [])).toEqual(false)
        // expect(Helper.doesUserExist('d1234')).toEqual(false)
        // expect(Helper.isInvitationAllowed('d1234', [])).toEqual(false)
    })

    it('should check whether user has already been invited by this user', () => {

        const friendsEMailAddress = 'michael@peer2peer-enterprise.org'
        expect(Helper.hasUserAlreadyInvitedThisFriend('michael.spengler@sap.com', friendsEMailAddress, getTestDataInvitationsList())).toEqual(true)
    })

})

function getTestDataInvitationsList(): any {
    return [
        {
            from: 'michael.spengler@sap.com',
            invitedFriends: [
                {
                    date: 'Sun Feb 09 2020 22:38:51 GMT+0100',
                    eMail: 'michael@peer2peer-enterprise.org',
                },
                {
                    date: 'Sun Feb 09 2020 22:40:39 GMT+0100',
                    eMail: 'michael@peer2peer-enterprise.org',
                },
                {
                    date: 'Sun Feb 09 2020 22:41:45 GMT+0100',
                    eMail: 'michael@peer2peer-enterprise.org',
                },
                {
                    date: 'Sun Feb 09 2020 22:44:34 GMT+0100',
                    eMail: 'michael@peer2peer-enterprise.org',
                },
            ],
        },
    ]
}
