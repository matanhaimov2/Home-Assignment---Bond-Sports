import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 1, description: 'The unique ID of the account' })
  @IsInt()
  accountId: number;

  @ApiProperty({ example: 150.5, description: 'The amount to deposit' })
  @IsNumber()
  @IsPositive()
  value: number;
}
