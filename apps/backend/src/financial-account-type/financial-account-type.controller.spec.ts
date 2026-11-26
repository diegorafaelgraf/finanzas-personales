import { Test, TestingModule } from '@nestjs/testing';
import { FinancialAccountTypeController } from './financial-account-type.controller';
import { FinancialAccountTypeService } from './financial-account-type.service';

describe('FinancialAccountTypeController', () => {
  let controller: FinancialAccountTypeController;
  const findAll = jest.fn();
  const findById = jest.fn();
  const add = jest.fn();
  const deleteRecord = jest.fn();

  beforeEach(async () => {
    findAll.mockReset();
    findById.mockReset();
    add.mockReset();
    deleteRecord.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialAccountTypeController],
      providers: [
        {
          provide: FinancialAccountTypeService,
          useValue: { findAll, findById, add, delete: deleteRecord },
        },
      ],
    }).compile();

    controller = module.get<FinancialAccountTypeController>(
      FinancialAccountTypeController,
    );
  });

  it('delegates findAll to the service', async () => {
    const financialAccountTypes = [{ id: 'type-id', name: 'Cash' }];
    findAll.mockResolvedValue(financialAccountTypes);

    await expect(controller.findAll()).resolves.toEqual(financialAccountTypes);
  });

  it('delegates findById to the service', async () => {
    const financialAccountType = { id: 'type-id', name: 'Cash' };
    findById.mockResolvedValue(financialAccountType);

    await expect(controller.findById('type-id')).resolves.toEqual(
      financialAccountType,
    );
    expect(findById).toHaveBeenCalledWith('type-id');
  });

  it('delegates add to the service', async () => {
    const dto = { name: 'Cash' };
    const financialAccountType = { id: 'type-id', name: dto.name };
    add.mockResolvedValue(financialAccountType);

    await expect(controller.add(dto)).resolves.toEqual(financialAccountType);
    expect(add).toHaveBeenCalledWith(dto);
  });

  it('delegates delete to the service', async () => {
    const financialAccountType = { id: 'type-id', name: 'Cash' };
    deleteRecord.mockResolvedValue(financialAccountType);

    await expect(controller.delete('type-id')).resolves.toEqual(
      financialAccountType,
    );
    expect(deleteRecord).toHaveBeenCalledWith('type-id');
  });
});
