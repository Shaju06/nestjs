import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import type { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    
    constructor(private readonly taskService: TasksService) {

    }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] | undefined {
        if(Object.keys(filterDto).length) { 
            return this.taskService.getTasksWithFilters(filterDto);
        } else {
            return this.taskService.getAllTasks();
        }
        
    }

    @Post()
    createTask(@Body() createTaskDto :CreateTaskDto): Task {
       return this.taskService.createTask(createTaskDto);
    }

    @Get('/:id') 
    getTaskById(@Param("id") id: string): Task | undefined {
        return this.taskService.getTaskById(id); 
    }

    @Delete('/:id')
    deleteTask(@Param("id") id: string): void {
        this.taskService.deleteTask(id);
    }

    @Patch('/:id/status/')
    updateTaskStatus(
        @Param("id") id: string,
        @Body("status") status: string,
    ): Task | undefined {
        return this.taskService.updateTaskStatus(id, status as TaskStatus);
    }

}
