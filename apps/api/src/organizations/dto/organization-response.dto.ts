import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({
    example: 'd5ef39d6-96bc-4a1d-b57d-cd3bda7efc45',
  })
  id!: string;

  @ApiProperty({
    example: 'OpenAI',
  })
  name!: string;

  @ApiPropertyOptional({
    example: 'Artificial Intelligence Research Organization',
  })
  description?: string | null;

  @ApiProperty({
    example: '2026-07-03T10:30:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-07-03T10:30:00.000Z',
  })
  updatedAt!: Date;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
  })
  deletedAt?: Date | null;
}