import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async deposit(data: DepositDto) {
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({
        where: { accountId: data.accountId },
      });

      if (!account) throw new NotFoundException('Account not found');
      if (!account.activeFlag)
        throw new BadRequestException('Account is inactive');

      // Update balance and create transaction
      await tx.account.update({
        where: { accountId: data.accountId },
        data: { balance: { increment: data.value } },
      });

      return tx.transaction.create({
        data: {
          accountId: data.accountId,
          value: data.value,
          type: 'DEPOSIT',
        },
      });
    });
  }

  async withdraw(data: WithdrawDto) {
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({
        where: { accountId: data.accountId },
      });

      if (!account) throw new NotFoundException('Account not found');
      if (!account.activeFlag)
        throw new BadRequestException('Account is inactive');
      if (account.balance < data.value)
        throw new BadRequestException('Insufficient balance');

      // Check daily limit
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const totalWithdrawnToday = await tx.transaction.aggregate({
        where: {
          accountId: data.accountId,
          type: 'WITHDRAWAL',
          transactionDate: { gte: startOfDay },
        },
        _sum: { value: true },
      });

      const currentWithdrawn = Math.abs(totalWithdrawnToday._sum.value || 0);
      if (currentWithdrawn + data.value > account.dailyWithdrawalLimit) {
        throw new BadRequestException('Daily withdrawal limit exceeded');
      }

      // Update balance and create transaction
      await tx.account.update({
        where: { accountId: data.accountId },
        data: { balance: { decrement: data.value } },
      });

      return tx.transaction.create({
        data: {
          accountId: data.accountId,
          value: data.value * -1, // Storing as negative for withdrawals
          type: 'WITHDRAWAL',
        },
      });
    });
  }
}
