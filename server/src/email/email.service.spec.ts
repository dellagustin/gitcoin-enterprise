import { Test, TestingModule } from '@nestjs/testing'
import { EmailService } from './email.service'
import { LoggerService } from '../logger/logger.service'
import { IEmail } from '../interfaces'

describe('EmailService', () => {
  let service: EmailService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [LoggerService, EmailService],
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
    expect(service.sendEMail(eMail)).toEqual({success: true})
  })
})
