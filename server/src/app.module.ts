import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoggerService } from './logger/logger.service'
import { EmailService } from './email/email.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, LoggerService, EmailService],
})
export class AppModule { }
