import {
  IsJSON,
  IsOptional,
} from 'class-validator';

export class ExecuteJobDto {
  @IsOptional()
  @IsJSON()
  result?: object;
}