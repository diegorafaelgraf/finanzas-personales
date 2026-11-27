import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { MovementService } from './movement.service';

describe('MovementService', () => {
  let service: MovementService;
  const findAccount = jest.fn();
  const findAccounts = jest.fn();
  const findMovementType = jest.fn();
  const createMovement = jest.fn();
  const findFinancialAccountWithMovements = jest.fn();
  const transaction = {
    financialAccount: { findMany: findAccounts, findUnique: findAccount },
    movementType: { findUnique: findMovementType },
    movement: { create: createMovement },
  };
  const prismaTransaction = jest.fn();

  beforeEach(async () => {
    findAccount.mockReset();
    findAccounts.mockReset();
    findFinancialAccountWithMovements.mockReset();
    findMovementType.mockReset();
    createMovement.mockReset();
    prismaTransaction.mockReset();
    prismaTransaction.mockImplementation((callback) => callback(transaction));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovementService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: prismaTransaction,
            financialAccount: {
              findUnique: findFinancialAccountWithMovements,
            },
          },
        },
      ],
    }).compile();

    service = module.get<MovementService>(MovementService);
  });

  it('returns account movements newest first with type and expense category details', async () => {
    const movements = [
      {
        id: 'movement-id',
        amount: -120,
        movementType: { code: 'EXPENSE' },
        expense: { name: 'Groceries', category: { name: 'Food' } },
      },
    ];
    findFinancialAccountWithMovements.mockResolvedValue({
      id: 'account-id',
      movements,
    });

    await expect(
      service.findByFinancialAccountId('account-id'),
    ).resolves.toEqual(movements);
    expect(findFinancialAccountWithMovements).toHaveBeenCalledWith({
      where: { id: 'account-id' },
      select: {
        id: true,
        movements: {
          include: {
            movementType: true,
            expense: { include: { category: true } },
          },
          orderBy: { date: 'desc' },
        },
      },
    });
  });

  it('returns not found when the financial account does not exist', async () => {
    findFinancialAccountWithMovements.mockResolvedValue(null);

    await expect(
      service.findByFinancialAccountId('unknown-account-id'),
    ).rejects.toThrow('Financial account not found');
  });

  it.each([25, -25])(
    'creates an adjustment with signed amount %s',
    async (amount) => {
      findAccount.mockResolvedValue({ id: 'account-id' });
      findMovementType.mockResolvedValue({ id: 'adjustment-type-id' });
      createMovement.mockResolvedValue({ id: 'adjustment-id' });

      await service.createAdjustment({
        financialAccountId: 'account-id',
        amount,
        date: '2026-11-27T12:00:00.000Z',
      });

      expect(findMovementType).toHaveBeenCalledWith({
        where: { code: 'ADJUSTMENT' },
      });
      expect(createMovement).toHaveBeenCalledWith({
        data: {
          financialAccountId: 'account-id',
          movementTypeId: 'adjustment-type-id',
          date: new Date('2026-11-27T12:00:00.000Z'),
          amount,
        },
        include: { movementType: true },
      });
    },
  );

  it('rejects a zero adjustment amount', async () => {
    await expect(
      service.createAdjustment({
        financialAccountId: 'account-id',
        amount: 0,
        date: '2026-11-27T12:00:00.000Z',
      }),
    ).rejects.toThrow(BadRequestException);
    expect(prismaTransaction).not.toHaveBeenCalled();
  });

  it('creates both transfer movements with opposite amounts and a shared operation id', async () => {
    findAccounts.mockResolvedValue([
      { id: 'source-id', currencyId: 'currency-id' },
      { id: 'destination-id', currencyId: 'currency-id' },
    ]);
    findMovementType.mockResolvedValue({ id: 'transfer-type-id' });
    createMovement
      .mockResolvedValueOnce({ id: 'outgoing-id' })
      .mockResolvedValueOnce({ id: 'incoming-id' });

    await expect(
      service.createTransfer({
        sourceFinancialAccountId: 'source-id',
        destinationFinancialAccountId: 'destination-id',
        amount: 500,
        date: '2026-11-26T12:00:00.000Z',
      }),
    ).resolves.toEqual([{ id: 'outgoing-id' }, { id: 'incoming-id' }]);

    const [outgoing, incoming] = createMovement.mock.calls.map(
      ([input]) => input,
    );
    expect(outgoing.data.amount).toBe(-500);
    expect(incoming.data.amount).toBe(500);
    expect(outgoing.data.operationId).toBe(incoming.data.operationId);
    expect(outgoing.data.movementTypeId).toBe('transfer-type-id');
  });

  it('creates sale movements with different amounts and one shared operation id', async () => {
    findAccounts.mockResolvedValue([
      { id: 'source-id', currencyId: 'crypto-id' },
      { id: 'destination-id', currencyId: 'fiat-id' },
    ]);
    findMovementType.mockResolvedValue({ id: 'sale-type-id' });
    createMovement
      .mockResolvedValueOnce({ id: 'sold-id' })
      .mockResolvedValueOnce({ id: 'received-id' });

    await service.createSale({
      sourceFinancialAccountId: 'source-id',
      destinationFinancialAccountId: 'destination-id',
      sourceAmount: 0.25,
      destinationAmount: 15000,
      date: '2026-11-26T12:00:00.000Z',
    });

    const [sold, received] = createMovement.mock.calls.map(([input]) => input);
    expect(sold.data.amount).toBe(-0.25);
    expect(received.data.amount).toBe(15000);
    expect(sold.data.operationId).toBe(received.data.operationId);
    expect(sold.data.movementTypeId).toBe('sale-type-id');
  });
});
