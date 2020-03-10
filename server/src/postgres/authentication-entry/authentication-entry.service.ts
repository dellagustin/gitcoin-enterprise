import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthenticationEntry } from './authentication-entry.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AuthenticationEntryService {

    public constructor(
        @InjectRepository(AuthenticationEntry)
        private readonly authenticationEntryRepository: Repository<AuthenticationEntry>) { }

    public async create(ledgerEntry: AuthenticationEntry): Promise<AuthenticationEntry[]> {
        return this.authenticationEntryRepository.save([ledgerEntry])
    }

    public async findAll(): Promise<AuthenticationEntry[]> {
        return this.authenticationEntryRepository.find()
    }

    public async findOne(id: string): Promise<AuthenticationEntry> {
        return this.authenticationEntryRepository.findOne(id)
    }

    public async removeAll(): Promise<void> {
        await this.authenticationEntryRepository.query('Delete from authentication_entry')
    }

}
