import { IsInt, IsNumber, IsPositive, Min, IsIn } from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  personId: number;

  @IsNumber()
  @Min(0)
  balance: number;

  @IsNumber()
  @IsPositive()
  dailyWithdrawalLimit: number;

  @IsInt()
  @IsIn([1, 2], {
    message: 'accountType must be either 1 (Checking) or 2 (Savings)',
  })
  accountType: number; // 1 = Checking, 2 = Savings
}
