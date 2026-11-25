import { Test, TestingModule } from '@nestjs/testing';
import { AccountHolderService } from './account-holder.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';

describe('AccountHolderService', () => {
  let service: AccountHolderService;
  const create = jest.fn();
  const remove = jest.fn();

  beforeEach(async () => {
    create.mockReset();
    remove.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountHolderService,
        {
          provide: PrismaService,
          useValue: {
            accountHolder: { create, delete: remove, findMany: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<AccountHolderService>(AccountHolderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an account holder with a trimmed name', async () => {
    const accountHolder = { id: 'holder-id', name: 'Ada Lovelace' };
    create.mockResolvedValue(accountHolder);

    await expect(service.create({ name: '  Ada Lovelace  ' })).resolves.toEqual(
      accountHolder,
    );
    expect(create).toHaveBeenCalledWith({
      data: { name: 'Ada Lovelace' },
    });
  });

  it('rejects an empty name', async () => {
    await expect(service.create({ name: '  ' })).rejects.toThrow(
      BadRequestException,
    );
    expect(create).not.toHaveBeenCalled();
  });

  it('propagates database errors to the global exception filter', async () => {
    const databaseError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: 'test',
      },
    );
    create.mockRejectedValue(databaseError);

    await expect(service.create({ name: 'Ada Lovelace' })).rejects.toBe(
      databaseError,
    );
  });

  it('deletes an account holder by id', async () => {
    const accountHolder = { id: 'holder-id', name: 'Ada Lovelace' };
    remove.mockResolvedValue(accountHolder);

    await expect(service.remove('holder-id')).resolves.toEqual(accountHolder);
    expect(remove).toHaveBeenCalledWith({ where: { id: 'holder-id' } });
  });
});
