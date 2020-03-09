import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LedgerEntry } from './ledger-entry.entity'

@Injectable()
export class LedgerEntriesService {
    public constructor(
        @InjectRepository(LedgerEntry)
        private readonly ledgerEntryRepository: Repository<LedgerEntry>) { }

    public async create(ledgerEntry: LedgerEntry): Promise<LedgerEntry[]> {
        return this.ledgerEntryRepository.save([ledgerEntry])
    }

    public async findAll(): Promise<LedgerEntry[]> {
        return this.ledgerEntryRepository.find()
    }

    public async findOne(id: string): Promise<LedgerEntry> {
        return this.ledgerEntryRepository.findOne(id)
    }

}
