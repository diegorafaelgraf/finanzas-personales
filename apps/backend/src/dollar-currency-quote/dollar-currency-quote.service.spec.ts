import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { DollarCurrencyQuoteService } from './dollar-currency-quote.service';

describe('DollarCurrencyQuoteService', () => {
  let service: DollarCurrencyQuoteService;
  const findCurrency = jest.fn();
  const create = jest.fn();

  beforeEach(async () => {
    findCurrency.mockReset();
    create.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DollarCurrencyQuoteService,
        {
          provide: PrismaService,
          useValue: {
            currency: { findUnique: findCurrency },
            dollarCurrencyQuote: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create,
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DollarCurrencyQuoteService>(
      DollarCurrencyQuoteService,
    );
  });

  it('creates a quote after checking that its currency exists', async () => {
    findCurrency.mockResolvedValue({ id: 'currency-id' });
    create.mockResolvedValue({ id: 'quote-id' });

    await expect(
      service.add({
        currencyId: 'currency-id',
        date: '2026-11-26T00:00:00.000Z',
        usdValue: 1.02,
      }),
    ).resolves.toEqual({ id: 'quote-id' });
    expect(create).toHaveBeenCalledWith({
      data: {
        currencyId: 'currency-id',
        date: new Date('2026-11-26T00:00:00.000Z'),
        usdValue: 1.02,
      },
      include: { currency: true },
    });
  });
});
