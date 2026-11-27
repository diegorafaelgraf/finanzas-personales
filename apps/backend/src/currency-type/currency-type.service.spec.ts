import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CurrencyTypeService } from './currency-type.service';

describe('CurrencyTypeService', () => {
  let service: CurrencyTypeService;
  const create = jest.fn();

  beforeEach(async () => {
    create.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyTypeService,
        {
          provide: PrismaService,
          useValue: {
            currencyType: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create,
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CurrencyTypeService>(CurrencyTypeService);
  });

  it('creates a currency type with a trimmed name', async () => {
    const currencyType = { id: 'type-id', name: 'Fiat' };
    create.mockResolvedValue(currencyType);

    await expect(service.add({ name: ' Fiat ' })).resolves.toEqual(
      currencyType,
    );
    expect(create).toHaveBeenCalledWith({ data: { name: 'Fiat' } });
  });

  it('rejects an empty name', async () => {
    await expect(service.add({ name: ' ' })).rejects.toThrow(
      BadRequestException,
    );
  });
});
