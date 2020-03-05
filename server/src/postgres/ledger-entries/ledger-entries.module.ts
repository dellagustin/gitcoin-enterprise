import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
// import { LedgerEntriesService } from './ledger-entries.service'
import { LedgerEntry } from './ledger-entry.entity'
import { LedgerEntriesService } from './ledger-entries.service'

@Module({
    imports: [TypeOrmModule.forFeature([LedgerEntry])],
    exports: [TypeOrmModule],
    providers: [LedgerEntriesService],
    controllers: [],
})
export class LedgerEntriesModule { }
