import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { MovementTypeService } from './movement-type.service';

describe('MovementTypeService', () => {
  let service: MovementTypeService;
  const findMany = jest.fn();
  const findUnique = jest.fn();

  beforeEach(async () => {
    findMany.mockReset();
    findUnique.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovementTypeService,
        {
          provide: PrismaService,
          useValue: { movementType: { findMany, findUnique } },
        },
      ],
    }).compile();

    service = module.get<MovementTypeService>(MovementTypeService);
  });

  it('lists the fixed movement types', async () => {
    const movementTypes = [{ id: 'type-id', code: 'EXPENSE', name: 'Expense' }];
    findMany.mockResolvedValue(movementTypes);

    await expect(service.findAll()).resolves.toEqual(movementTypes);
  });
});
