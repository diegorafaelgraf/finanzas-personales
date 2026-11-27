import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { FinancialAccountService } from './financial-account.service';

describe('FinancialAccountService', () => {
  let service: FinancialAccountService;
  const findAccountHolder = jest.fn();
  const findAccountType = jest.fn();
  const findCurrency = jest.fn();
  const create = jest.fn();

  beforeEach(async () => {
    findAccountHolder.mockReset();
    findAccountType.mockReset();
    findCurrency.mockReset();
    create.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialAccountService,
        {
          provide: PrismaService,
          useValue: {
            accountHolder: { findUnique: findAccountHolder },
            financialAccountType: { findUnique: findAccountType },
            currency: { findUnique: findCurrency },
            financialAccount: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create,
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FinancialAccountService>(FinancialAccountService);
  });

  it('creates an account after validating all related records', async () => {
    findAccountHolder.mockResolvedValue({ id: 'holder-id' });
    findAccountType.mockResolvedValue({ id: 'type-id' });
    findCurrency.mockResolvedValue({ id: 'currency-id' });
    const account = { id: 'account-id' };
    create.mockResolvedValue(account);

    await expect(
      service.add({
        accountHolderId: 'holder-id',
        financialAccountTypeId: 'type-id',
        currencyId: 'currency-id',
      }),
    ).resolves.toEqual(account);
    expect(create).toHaveBeenCalledWith({
      data: {
        accountHolderId: 'holder-id',
        financialAccountTypeId: 'type-id',
        currencyId: 'currency-id',
      },
      include: {
        accountHolder: true,
        financialAccountType: true,
        currency: true,
      },
    });
  });
});
