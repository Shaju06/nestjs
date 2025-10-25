import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from './tasks.model';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.PENDING,
        };
        
        this.tasks.push(task);
        return task
    }

    getTaskById(id: string): Task | undefined {
        if(this.tasks.length === 0) {
            throw new Error('No tasks available');
        }
        return this.tasks.find(task => task.id === id);
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    updateTaskStatus(id: string, status: TaskStatus): Task | undefined {
        const task = this.getTaskById(id);
        if (task) {
            task.status = status;
        }
        return task;
    } 
    
    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const currTasks = this.getAllTasks();
        const { status, search } = filterDto;

        let tasks = currTasks;

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(task => 
                task.title.includes(search) || 
                task.description.includes(search)
            );
        }

        return tasks;
    }

    

}
