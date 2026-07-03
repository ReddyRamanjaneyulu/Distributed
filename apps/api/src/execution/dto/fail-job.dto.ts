import {
  IsOptional,
  IsString,
} from 'class-validator';

export class FailJobDto {
  @IsOptional()
  @IsString()
  message?: string;
}