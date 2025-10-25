import { IsEnum } from "class-validator";
import { TaskStatus } from "../tasks.model";

export class CreateTaskStatusDto {
    @IsEnum(TaskStatus)
    status: TaskStatus
}