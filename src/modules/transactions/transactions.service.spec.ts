/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockPrisma = {
    account: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
      createMany: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  describe('deposit', () => {
    // Should update account balance successfully when the account is active
    it('should successfully deposit money', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        accountId: 1,
        activeFlag: true,
      });

      await service.deposit({ accountId: 1, value: 100 });

      expect(mockPrisma.account.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { balance: { increment: 100 } },
        }),
      );
    });

    // Should reject deposit attempt if the account has been marked as inactive
    it('should throw BadRequestException if account is inactive', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        accountId: 1,
        activeFlag: false,
      });
      await expect(
        service.deposit({ accountId: 1, value: 100 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('withdraw', () => {
    // Should return 404 error when attempting to withdraw from a non-existent account
    it('should throw NotFoundException if account does not exist', async () => {
      mockPrisma.account.findUnique.mockResolvedValue(null);
      await expect(
        service.withdraw({ accountId: 999, value: 100 }),
      ).rejects.toThrow(NotFoundException);
    });

    // Should prevent withdrawal if the available balance is lower than the requested amount
    it('should throw BadRequestException if balance is insufficient', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        accountId: 1,
        balance: 50,
        activeFlag: true,
        dailyWithdrawalLimit: 1000,
      });
      await expect(
        service.withdraw({ accountId: 1, value: 100 }),
      ).rejects.toThrow(BadRequestException);
    });

    // Should enforce daily withdrawal limits by checking the sum of today's transactions
    it('should throw BadRequestException if daily limit is exceeded', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({
        accountId: 1,
        balance: 500,
        activeFlag: true,
        dailyWithdrawalLimit: 200,
      });
      mockPrisma.transaction.aggregate.mockResolvedValue({
        _sum: { value: -150 },
      });

      await expect(
        service.withdraw({ accountId: 1, value: 100 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getStatement', () => {
    // Should retrieve and return the list of transactions for the specified account
    it('should return transaction history for valid account', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ accountId: 1 });
      mockPrisma.transaction.findMany.mockResolvedValue([{ id: 1, value: 50 }]);

      const result = await service.getStatement(1, {});
      expect(result).toHaveLength(1);
    });
  });

  describe('transfer', () => {
    it('should successfully transfer money between accounts', async () => {
      // Setup: The command will succeed
      mockPrisma.account.update.mockResolvedValue({
        accountId: 1,
        balance: 100,
      });

      const transferData = { fromAccountId: 1, toAccountId: 2, amount: 50 };

      const result = await service.transfer(transferData);

      // Check that 2 updates were made (one for source, one for destination)
      expect(mockPrisma.account.update).toHaveBeenCalledTimes(2);
      // Check that 2 transactions were created (in/out)
      expect(mockPrisma.transaction.createMany).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if account balance is insufficient', async () => {
      mockPrisma.account.update.mockRejectedValueOnce(
        new BadRequestException('Insufficient funds'),
      );

      const transferData = { fromAccountId: 1, toAccountId: 2, amount: 999999 };

      await expect(service.transfer(transferData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
