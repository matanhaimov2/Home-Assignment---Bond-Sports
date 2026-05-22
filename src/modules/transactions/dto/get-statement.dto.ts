import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

export class GetStatementDto {
  @ApiPropertyOptional({
    example: '2026-05-01',
    description: 'Start date in ISO8601 format (YYYY-MM-DD)',
  })
  @IsISO8601()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-05-22',
    description: 'End date in ISO8601 format (YYYY-MM-DD)',
  })
  @IsISO8601()
  @IsOptional()
  endDate?: string;
}
