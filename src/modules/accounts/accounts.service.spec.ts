import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AccountsService', () => {
  let service: AccountsService;

  const mockPrisma = {
    account: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  describe('createAccount', () => {
    // Should successfully persist a new account in the database when provided with valid DTO
    it('should successfully create an account', async () => {
      const dto = {
        personId: 123,
        balance: 1000,
        dailyWithdrawalLimit: 500,
        accountType: 1,
      };
      mockPrisma.account.create.mockResolvedValue({ accountId: 1, ...dto });

      const result = await service.createAccount(dto);
      expect(result).toBeDefined();
      expect(result.personId).toEqual(123);
      expect(mockPrisma.account.create).toHaveBeenCalled();
    });
  });
});
