import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, Min, IsIn } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    example: 12345,
    description: 'The unique ID of the person owning the account',
  })
  @IsInt()
  personId: number;

  @ApiProperty({
    example: 1000.0,
    description: 'The initial balance of the account',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  balance: number;

  @ApiProperty({
    example: 500.0,
    description: 'The maximum amount that can be withdrawn in a single day',
  })
  @IsNumber()
  @IsPositive()
  dailyWithdrawalLimit: number;

  @ApiProperty({
    example: 1,
    description: 'Account type: 1 for Checking, 2 for Savings',
    enum: [1, 2],
  })
  @IsInt()
  @IsIn([1, 2], {
    message: 'accountType must be either 1 (Checking) or 2 (Savings)',
  })
  accountType: number; // 1 = Checking, 2 = Savings
}
