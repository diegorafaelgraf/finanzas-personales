import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { FinancialAccountTypeService } from './financial-account-type.service';

describe('FinancialAccountTypeService', () => {
  let service: FinancialAccountTypeService;
  const findMany = jest.fn();
  const findUnique = jest.fn();
  const create = jest.fn();
  const deleteRecord = jest.fn();

  beforeEach(async () => {
    findMany.mockReset();
    findUnique.mockReset();
    create.mockReset();
    deleteRecord.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialAccountTypeService,
        {
          provide: PrismaService,
          useValue: {
            financialAccountType: {
              findMany,
              findUnique,
              create,
              delete: deleteRecord,
            },
          },
        },
      ],
    }).compile();

    service = module.get<FinancialAccountTypeService>(
      FinancialAccountTypeService,
    );
  });

  it('returns all financial account types', async () => {
    const financialAccountTypes = [{ id: 'type-id', name: 'Cash' }];
    findMany.mockResolvedValue(financialAccountTypes);

    await expect(service.findAll()).resolves.toEqual(financialAccountTypes);
    expect(findMany).toHaveBeenCalledWith();
  });

  it('returns a financial account type by id', async () => {
    const financialAccountType = { id: 'type-id', name: 'Cash' };
    findUnique.mockResolvedValue(financialAccountType);

    await expect(service.findById('type-id')).resolves.toEqual(
      financialAccountType,
    );
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 'type-id' } });
  });

  it('throws when the financial account type does not exist', async () => {
    findUnique.mockResolvedValue(null);

    await expect(service.findById('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('adds a financial account type with a trimmed name', async () => {
    const financialAccountType = { id: 'type-id', name: 'Cash' };
    create.mockResolvedValue(financialAccountType);

    await expect(service.add({ name: '  Cash  ' })).resolves.toEqual(
      financialAccountType,
    );
    expect(create).toHaveBeenCalledWith({ data: { name: 'Cash' } });
  });

  it('rejects an empty name', async () => {
    await expect(service.add({ name: '  ' })).rejects.toThrow(
      BadRequestException,
    );
    expect(create).not.toHaveBeenCalled();
  });

  it('deletes a financial account type by id', async () => {
    const financialAccountType = { id: 'type-id', name: 'Cash' };
    deleteRecord.mockResolvedValue(financialAccountType);

    await expect(service.delete('type-id')).resolves.toEqual(
      financialAccountType,
    );
    expect(deleteRecord).toHaveBeenCalledWith({ where: { id: 'type-id' } });
  });
});
