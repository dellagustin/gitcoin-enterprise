import { Test, TestingModule } from '@nestjs/testing'
import { Helper } from './helper'
const fs = require('fs-sync')
const path = require('path')

const fileIdInvitationLists = path.join(
    path.resolve(),
    '../server/operational-data/invitation-lists.json',
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
        expect(Helper.isUserADemoUser('d123')).toEqual(true)
        expect(Helper.isInvitationAllowed('d123', [])).toEqual(false)
        expect(Helper.doesUserExist('d1234')).toEqual(false)
        expect(Helper.isInvitationAllowed('d1234', [])).toEqual(false)
    })

    // it('should add an invitation via sendEMail', async () => {
    //   const eMail: IEmail = {
    //     senderUserId: 'd123',
    //     sender: 'michael@spengler.biz',
    //     recipient: 'michael.spengler@sap.com',
    //     subject: 'I love unit testing',
    //     content: 'I love the Ethereum Network',
    //   }
    //   expect(await service.sendEMail(eMail)).toEqual({ success: false })
    // })

})
