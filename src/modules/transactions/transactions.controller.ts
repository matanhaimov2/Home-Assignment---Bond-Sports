import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  async deposit(@Body() depositDto: DepositDto) {
    return this.transactionsService.deposit(depositDto);
  }

  @Post('withdraw')
  async withdraw(@Body() withdrawDto: WithdrawDto) {
    return this.transactionsService.withdraw(withdrawDto);
  }
}
