import { Test, TestingModule } from '@nestjs/testing';
import { AccountHolderController } from './account-holder.controller';
import { AccountHolderService } from './account-holder.service';

describe('AccountHolderController', () => {
  let controller: AccountHolderController;
  const create = jest.fn();

  beforeEach(async () => {
    create.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountHolderController],
      providers: [
        {
          provide: AccountHolderService,
          useValue: { create, findAll: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AccountHolderController>(AccountHolderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates account holder creation to the service', async () => {
    const dto = { name: 'Ada Lovelace' };
    const accountHolder = { id: 'holder-id', name: dto.name };
    create.mockResolvedValue(accountHolder);

    await expect(controller.create(dto)).resolves.toEqual(accountHolder);
    expect(create).toHaveBeenCalledWith(dto);
  });
});
