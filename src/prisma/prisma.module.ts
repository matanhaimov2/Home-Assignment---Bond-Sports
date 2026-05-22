import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // This makes the module available everywhere without re-importing it
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
