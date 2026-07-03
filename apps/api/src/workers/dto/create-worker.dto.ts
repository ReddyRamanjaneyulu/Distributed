import {
  IsInt,
  IsJSON,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  hostname: string;

  @IsInt()
  @Min(1)
  processId: number;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsJSON()
  tags?: object;
}