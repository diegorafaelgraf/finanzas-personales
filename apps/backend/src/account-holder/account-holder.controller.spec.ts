import { Test, TestingModule } from '@nestjs/testing';
import { AccountHolderController } from './account-holder.controller';

describe('AccountHolderController', () => {
  let controller: AccountHolderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountHolderController],
    }).compile();

    controller = module.get<AccountHolderController>(AccountHolderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
