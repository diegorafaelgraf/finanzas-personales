import { Test, TestingModule } from '@nestjs/testing';
import { AccountHolderController } from './account-holder.controller';
import { AccountHolderService } from './account-holder.service';

describe('AccountHolderController', () => {
  let controller: AccountHolderController;
  const create = jest.fn();
  const remove = jest.fn();
  const findById = jest.fn();

  beforeEach(async () => {
    create.mockReset();
    remove.mockReset();
    findById.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountHolderController],
      providers: [
        {
          provide: AccountHolderService,
          useValue: { create, findAll: jest.fn(), findById, remove },
        },
      ],
    }).compile();

    controller = module.get<AccountHolderController>(AccountHolderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates account holder lookup by id to the service', async () => {
    const accountHolder = { id: 'holder-id', name: 'Ada Lovelace' };
    findById.mockResolvedValue(accountHolder);

    await expect(controller.findById('holder-id')).resolves.toEqual(
      accountHolder,
    );
    expect(findById).toHaveBeenCalledWith('holder-id');
  });

  it('delegates account holder creation to the service', async () => {
    const dto = { name: 'Ada Lovelace' };
    const accountHolder = { id: 'holder-id', name: dto.name };
    create.mockResolvedValue(accountHolder);

    await expect(controller.create(dto)).resolves.toEqual(accountHolder);
    expect(create).toHaveBeenCalledWith(dto);
  });

  it('delegates account holder deletion to the service', async () => {
    const accountHolder = { id: 'holder-id', name: 'Ada Lovelace' };
    remove.mockResolvedValue(accountHolder);

    await expect(controller.remove('holder-id')).resolves.toEqual(
      accountHolder,
    );
    expect(remove).toHaveBeenCalledWith('holder-id');
  });
});
