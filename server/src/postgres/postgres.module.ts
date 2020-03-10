import { Module } from '@nestjs/common'
import { LedgerEntriesModule } from './ledger-entries/ledger-entries.module'
import { AuthenticationEntryModule } from './authentication-entry/authentication-entry.module'
import { TaskModule } from './task/task.module'
import { PostgresController } from './postgres.controller'
import { PostgresService } from './postgres.service'

@Module({
    imports: [
        LedgerEntriesModule, AuthenticationEntryModule, TaskModule],
    controllers: [PostgresController],
    providers: [],
    exports: [LedgerEntriesModule, AuthenticationEntryModule, TaskModule],
})
export class PostgresModule {
}
