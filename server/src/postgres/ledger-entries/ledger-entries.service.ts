import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LedgerEntry } from './ledger-entry.entity'
import { LoggerService } from '../../logger/logger.service'
import { ELogLevel } from '../../logger/logger-interface'

@Injectable()
export class LedgerEntriesService {
    public constructor(
        @InjectRepository(LedgerEntry)
        private readonly ledgerEntryRepository: Repository<LedgerEntry>) {

        // setTimeout(async () => {
        //     const lE: LedgerEntry = {
        //         id: "2",
        //         date: "12.03.1980",
        //         amount: 1,
        //         sender: ':)',
        //         receiver: ':)'

        //     }
        //     console.log(ELogLevel.Info, 'hallo')
        //     console.log(ELogLevel.Info, JSON.stringify(await this.create(lE)))
        // }, 5000)

        // setTimeout(async () => {
        //     console.log(ELogLevel.Info, 'hallo')
        //     console.log(ELogLevel.Info, JSON.stringify(await this.findAll()))
        // }, 11000)

    }

    public async create(ledgerEntry: LedgerEntry): Promise<LedgerEntry[]> {
        return this.ledgerEntryRepository.save([ledgerEntry])
    }

    public async findAll(): Promise<LedgerEntry[]> {
        return this.ledgerEntryRepository.find()
    }

    public async findOne(id: string): Promise<LedgerEntry> {
        return this.ledgerEntryRepository.findOne(id)
    }

    public async remove(id: string): Promise<void> {
        await this.ledgerEntryRepository.delete(id)
    }
}
