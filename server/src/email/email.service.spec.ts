import { Test, TestingModule } from '@nestjs/testing'
import { EmailService } from './email.service'
import { IEmail } from '../interfaces'
import { SupportNotifierTestDouble } from '../support-notifier/support-notifier-test-double'
import { LoggerService } from '../logger/logger.service'
import { LoggerDouble } from '../logger/logger-test-double'
import { SupportNotifierService } from '../support-notifier/support-notifier.service'
const fs = require('fs-sync')
const path = require('path')

const fileIdInvitationLists = path.join(
  path.resolve(),
  '../server/operational-data/invitation-lists.json',
)

describe('EmailService', () => {
  let service: EmailService

  beforeEach(async () => {

    fs.write(fileIdInvitationLists, '[]')
    const loggerProvider = {
      provide: LoggerService,
      useValue: new LoggerDouble(),
    }

    const notifierProvider = {
      provide: SupportNotifierService,
      useValue: new SupportNotifierTestDouble(),
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [loggerProvider, EmailService, notifierProvider],
    }).compile()

    service = module.get<EmailService>(EmailService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should add an invitation via sendEMail', () => {
    const eMail: IEmail = {
      sender: 'michael@spengler.biz',
      recipient: 'michael.spengler@sap.com',
      subject: 'I love unit testing',
      content: 'It is a great invention. By the way I also love Ethereum.',
    }
    expect(service.sendEMail(eMail)).toEqual({ success: true })
  })
})
