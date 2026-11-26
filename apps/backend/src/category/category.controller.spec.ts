import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;
  const findById = jest.fn();
  const deleteCategory = jest.fn();

  beforeEach(async () => {
    findById.mockReset();
    deleteCategory.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAll: jest.fn(),
            findById,
            add: jest.fn(),
            delete: deleteCategory,
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('delegates findById to the service', async () => {
    const category = { id: 'category-id', name: 'Food' };
    findById.mockResolvedValue(category);

    await expect(controller.findById('category-id')).resolves.toEqual(category);
    expect(findById).toHaveBeenCalledWith('category-id');
  });

  it('delegates delete to the service', async () => {
    const category = { id: 'category-id', name: 'Food' };
    deleteCategory.mockResolvedValue(category);

    await expect(controller.delete('category-id')).resolves.toEqual(category);
    expect(deleteCategory).toHaveBeenCalledWith('category-id');
  });
});
