import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({ example: 1, description: 'The unique ID of the account' })
  @IsInt()
  accountId: number;

  @ApiProperty({ example: 50.0, description: 'The amount to withdraw' })
  @IsNumber()
  @IsPositive()
  value: number;
}
