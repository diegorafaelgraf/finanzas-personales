import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;
  const findCurrencyType = jest.fn();
  const create = jest.fn();

  beforeEach(async () => {
    findCurrencyType.mockReset();
    create.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: PrismaService,
          useValue: {
            currencyType: { findUnique: findCurrencyType },
            currency: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create,
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
  });

  it('creates a currency after validating its type', async () => {
    const currency = {
      id: 'currency-id',
      code: 'ARS',
      name: 'Argentine Peso',
      symbol: '$',
      currencyType: { id: 'type-id', name: 'Fiat' },
    };
    findCurrencyType.mockResolvedValue({ id: 'type-id' });
    create.mockResolvedValue(currency);

    await expect(
      service.add({
        currencyTypeId: 'type-id',
        code: ' ARS ',
        name: ' Argentine Peso ',
        symbol: ' $ ',
      }),
    ).resolves.toEqual(currency);
    expect(create).toHaveBeenCalledWith({
      data: {
        currencyTypeId: 'type-id',
        code: 'ARS',
        name: 'Argentine Peso',
        symbol: '$',
      },
      include: { currencyType: true },
    });
  });
});
