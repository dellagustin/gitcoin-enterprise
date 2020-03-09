import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TaskService {

    public constructor(
        @InjectRepository(Task)
        private readonly ledgerEntryRepository: Repository<Task>) { }

    public async create(ledgerEntry: Task): Promise<Task[]> {
        return this.ledgerEntryRepository.save([ledgerEntry])
    }

    public async findAll(): Promise<Task[]> {
        return this.ledgerEntryRepository.find()
    }

    public async findOne(id: string): Promise<Task> {
        return this.ledgerEntryRepository.findOne(id)
    }

}
