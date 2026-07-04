import {
  IsNumber,
} from 'class-validator';

export class WorkerHeartbeatDto {

  @IsNumber()
  cpuUsage: number;

  @IsNumber()
  memoryUsage: number;

  @IsNumber()
  activeJobs: number;

  @IsNumber()
  queuedJobs: number;
}