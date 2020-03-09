import { Module } from '@nestjs/common'
import { AuthenticationEntryService } from './authentication-entry.service'
import { AuthenticationEntryController } from './authentication-entry.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthenticationEntry } from './authentication-entry.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AuthenticationEntry])],
  providers: [AuthenticationEntryService],
  controllers: [AuthenticationEntryController],
  exports: [TypeOrmModule, AuthenticationEntryService],
})
export class AuthenticationEntryModule {}
