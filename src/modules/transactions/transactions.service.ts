import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { GetStatementDto } from './dto/get-statement.dto';
import { Prisma } from '@prisma/client';
import { TransferMoneyDto } from './dto/transfer-money.dto';

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

  async getStatement(accountId: number, filters: GetStatementDto) {
    // Check if the account exists
    const account = await this.prisma.account.findUnique({
      where: { accountId },
    });

    if (!account) throw new NotFoundException('Account not found');

    // Define the where object with the correct Prisma type to avoid ESLint errors
    const where: Prisma.TransactionWhereInput = {
      accountId: accountId,
    };

    if (filters.startDate || filters.endDate) {
      const dateFilter: Prisma.DateTimeFilter = {};

      if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
      if (filters.endDate) dateFilter.lte = new Date(filters.endDate);

      where.transactionDate = dateFilter;
    }

    return this.prisma.transaction.findMany({
      where,
      orderBy: { transactionDate: 'desc' },
    });
  }

  async transfer(dto: TransferMoneyDto) {
    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException(
        'Cannot transfer money to the same account',
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      // Check source account and balance
      const fromAccount = await tx.account.findUnique({
        where: { accountId: dto.fromAccountId },
      });
      if (!fromAccount || !fromAccount.activeFlag) {
        throw new BadRequestException('Source account not found or inactive');
      }

      // Check destination account
      const toAccount = await tx.account.findUnique({
        where: { accountId: dto.toAccountId },
      });
      if (!toAccount) {
        throw new NotFoundException('Destination account not found');
      }
      if (!toAccount.activeFlag) {
        throw new BadRequestException('Destination account is inactive');
      }

      if (fromAccount.balance < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Check daily withdrawal limit (treat transfer as withdrawal)
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const totalOutToday = await tx.transaction.aggregate({
        where: {
          accountId: dto.fromAccountId,
          type: { in: ['WITHDRAWAL', 'TRANSFER_OUT'] },
          transactionDate: { gte: startOfDay },
        },
        _sum: { value: true },
      });

      const currentOut = Math.abs(totalOutToday._sum.value || 0);
      if (currentOut + dto.amount > fromAccount.dailyWithdrawalLimit) {
        throw new BadRequestException('Daily withdrawal limit exceeded');
      }

      // Update accounts
      await tx.account.update({
        where: { accountId: dto.fromAccountId },
        data: { balance: { decrement: dto.amount } },
      });

      await tx.account.update({
        where: { accountId: dto.toAccountId },
        data: { balance: { increment: dto.amount } },
      });

      // Record transactions
      await tx.transaction.createMany({
        data: [
          {
            accountId: dto.fromAccountId,
            value: -dto.amount,
            type: 'TRANSFER_OUT',
          },
          {
            accountId: dto.toAccountId,
            value: dto.amount,
            type: 'TRANSFER_IN',
          },
        ],
      });

      return { message: 'Transfer successful' };
    });
  }
}
