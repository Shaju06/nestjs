import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks-status.enum';

export class CreateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
