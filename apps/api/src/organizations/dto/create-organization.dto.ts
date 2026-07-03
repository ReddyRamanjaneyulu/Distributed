import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'OpenAI',
    description: 'Organization name',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Artificial Intelligence Research Organization',
    description: 'Organization description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}