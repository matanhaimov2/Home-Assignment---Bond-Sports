import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [PrismaModule, AccountsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
