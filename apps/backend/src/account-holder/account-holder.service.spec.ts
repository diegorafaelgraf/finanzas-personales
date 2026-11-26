import { Test, TestingModule } from '@nestjs/testing';
import { AccountHolderService } from './account-holder.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';

describe('AccountHolderService', () => {
  let service: AccountHolderService;
  const create = jest.fn();
  const remove = jest.fn();
  const findUnique = jest.fn();

  beforeEach(async () => {
    create.mockReset();
    remove.mockReset();
    findUnique.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountHolderService,
        {
          provide: PrismaService,
          useValue: {
            accountHolder: {
              create,
              delete: remove,
              findMany: jest.fn(),
              findUnique,
            },
          },
        },
      ],
    }).compile();

    service = module.get<AccountHolderService>(AccountHolderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('finds an account holder by id', async () => {
    const accountHolder = { id: 'holder-id', name: 'Ada Lovelace' };
    findUnique.mockResolvedValue(accountHolder);

    await expect(service.findById('holder-id')).resolves.toEqual(accountHolder);
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 'holder-id' } });
  });

  it('throws when the account holder does not exist', async () => {
    findUnique.mockResolvedValue(null);

    await expect(service.findById('missing-id')).rejects.toThrow(
      NotFoundException,
    );
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
