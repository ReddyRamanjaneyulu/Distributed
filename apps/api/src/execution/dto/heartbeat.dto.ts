import {
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class HeartbeatDto {
  @IsOptional()
  @IsNumber()
  cpuUsage?: number;

  @IsOptional()
  @IsNumber()
  memoryUsage?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  activeJobs = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  queuedJobs = 0;
}