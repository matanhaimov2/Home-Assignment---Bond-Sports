import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class WithdrawDto {
  @IsInt()
  accountId: number;

  @IsNumber()
  @IsPositive()
  value: number;
}
