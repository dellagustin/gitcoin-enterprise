import { Controller, Get, Post } from '@nestjs/common'
import { TaskService } from './task.service'

@Controller('task')
export class TaskController {
    public constructor(private readonly tS: TaskService) {
    }

    @Get('/')
    public async findAll(): Promise<any> {
        return this.tS.findAll()
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
