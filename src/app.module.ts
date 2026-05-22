import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [PrismaModule, AccountsModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
