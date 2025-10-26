import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const data = this.tasksRepository.create({
      title,
      description,
    });
    return await this.tasksRepository.save(data);
  }
  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: {
        id,
      },
    });
    if (!found) {
      throw new NotFoundException(`Task with ID:  "${id}" not found`);
    }
    return found;
  }
  //
  async deleteTask(id: string): Promise<{ message: string }> {
    const resp = await this.tasksRepository.delete(id);
    if (!resp) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    return { message: 'Task deleted successfully' };
  }
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');

    const conditions: string[] = [];
    const params: Record<string, string> = {};

    if (status) {
      conditions.push('task.status = :status');
      params.status = status;
    }

    if (search) {
      conditions.push(
        '(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)',
      );
      params.search = `%${search.toLowerCase()}%`;
    }

    if (conditions.length > 0) {
      query.where(conditions.join(' AND '), params);
    }

    return await query.getMany();
  }
}
