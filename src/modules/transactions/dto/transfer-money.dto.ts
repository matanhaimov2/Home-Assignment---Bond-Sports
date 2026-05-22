import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferMoneyDto {
  @ApiProperty({ description: 'The ID of the account to transfer from' })
  @IsNumber()
  fromAccountId: number;

  @ApiProperty({ description: 'The ID of the account to transfer to' })
  @IsNumber()
  toAccountId: number;

  @ApiProperty({ description: 'The amount to transfer', minimum: 0.01 })
  @IsNumber()
  @IsPositive()
  amount: number;
}
