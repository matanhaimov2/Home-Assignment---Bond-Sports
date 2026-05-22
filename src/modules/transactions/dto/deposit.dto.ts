import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class DepositDto {
  @IsInt()
  accountId: number;

  @IsNumber()
  @IsPositive()
  value: number;
}
