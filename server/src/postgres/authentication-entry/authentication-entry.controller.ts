import { Controller, Get, Post } from '@nestjs/common'
import { AuthenticationEntryService } from './authentication-entry.service'

@Controller('authentication-entry')
export class AuthenticationEntryController {

    public constructor(private readonly aS: AuthenticationEntryService) {
    }

    @Get('/')
    public async findAll(): Promise<any> {
        return this.aS.findAll()
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
