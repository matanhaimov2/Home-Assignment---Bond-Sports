import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async createAccount(data: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        personId: data.personId,
        balance: data.balance,
        dailyWithdrawalLimit: data.dailyWithdrawalLimit,
        accountType: data.accountType,
      },
    });
  }

  async getAccountBalance(accountId: number) {
    const account = await this.prisma.account.findUnique({
      where: { accountId },
      select: { balance: true },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }

    return account;
  }
}
