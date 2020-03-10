import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TaskService {

    public constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>) { }

    public async create(task: Task): Promise<Task[]> {
        const savedTask = await this.taskRepository.save([task])

        return savedTask
    }

    public async findAll(): Promise<Task[]> {
        return this.taskRepository.find()
    }

    public async findOne(id: string): Promise<Task> {
        return this.taskRepository.findOne(id)
    }

    public async removeAll(): Promise<void> {
        await this.taskRepository.query('Delete from task')
        console.log('hi')
    }

}
