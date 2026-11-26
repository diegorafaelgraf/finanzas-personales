import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  const findMany = jest.fn();
  const findUnique = jest.fn();
  const create = jest.fn();
  const deleteCategory = jest.fn();

  beforeEach(async () => {
    findMany.mockReset();
    findUnique.mockReset();
    create.mockReset();
    deleteCategory.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: PrismaService,
          useValue: {
            category: { findMany, findUnique, create, delete: deleteCategory },
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('finds a category by id', async () => {
    const category = { id: 'category-id', name: 'Food' };
    findUnique.mockResolvedValue(category);

    await expect(service.findById('category-id')).resolves.toEqual(category);
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 'category-id' } });
  });

  it('returns not found when the category does not exist', async () => {
    findUnique.mockResolvedValue(null);

    await expect(service.findById('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deletes a category by id', async () => {
    const category = { id: 'category-id', name: 'Food' };
    deleteCategory.mockResolvedValue(category);

    await expect(service.delete('category-id')).resolves.toEqual(category);
    expect(deleteCategory).toHaveBeenCalledWith({
      where: { id: 'category-id' },
    });
  });

  it('rejects an empty category name', async () => {
    await expect(service.add({ name: '  ' })).rejects.toThrow(
      BadRequestException,
    );
    expect(create).not.toHaveBeenCalled();
  });
});
