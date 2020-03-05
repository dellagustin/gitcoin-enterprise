import { Module } from '@nestjs/common'
import { databaseProviders } from '../persistency/postgres.service'

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})

export class DatabaseModule { }
