import {
  IsBoolean,
  IsJSON,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateScheduledJobDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  cronExpression: string;

  @IsOptional()
  @IsString()
  timezone = 'UTC';

  @IsOptional()
  @IsBoolean()
  enabled = true;

  @IsString()
  @IsJSON()
  payload: string;

  @IsUUID()
  queueId: string;
}