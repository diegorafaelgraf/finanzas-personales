import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { BlueDollarRateService } from './blue-dollar-rate.service';

describe('BlueDollarRateService', () => {
  let service: BlueDollarRateService;
  const create = jest.fn();

  beforeEach(async () => {
    create.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlueDollarRateService,
        {
          provide: PrismaService,
          useValue: {
            blueDollarRate: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create,
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BlueDollarRateService>(BlueDollarRateService);
  });

  it('creates a rate with a parsed date', async () => {
    create.mockResolvedValue({ id: 'rate-id' });

    await expect(
      service.add({ date: '2026-11-26T00:00:00.000Z', usdArsBuy: 1450 }),
    ).resolves.toEqual({ id: 'rate-id' });
    expect(create).toHaveBeenCalledWith({
      data: {
        date: new Date('2026-11-26T00:00:00.000Z'),
        usdArsBuy: 1450,
      },
    });
  });

  it('rejects a non-positive buy rate', async () => {
    await expect(
      service.add({ date: '2026-11-26', usdArsBuy: 0 }),
    ).rejects.toThrow(BadRequestException);
  });
});
