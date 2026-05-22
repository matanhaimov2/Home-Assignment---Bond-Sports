import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.createAccount(createAccountDto);
  }

  @Get(':id/balance')
  async getBalance(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.getAccountBalance(id);
  }
}
