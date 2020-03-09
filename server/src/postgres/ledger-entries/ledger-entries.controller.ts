import { Controller, Get, Post } from '@nestjs/common'
import { LedgerEntriesService } from './ledger-entries.service'

@Controller('ledger-entries')
export class LedgerEntriesController {

    public constructor(private readonly lS: LedgerEntriesService) {
    }

    @Get('/')
    public async findAll(): Promise<any> {
        return this.lS.findAll()
    }

    @Get(':id')
    public getLedgerEntry() {
        // tbd
    }

    @Post()
    public postLedgerEntries() {
        // tbd
    }

}
