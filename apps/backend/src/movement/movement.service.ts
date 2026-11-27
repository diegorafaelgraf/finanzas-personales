import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class MovementService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdjustment(dto: CreateAdjustmentDto) {
    const amount = this.validateAdjustmentAmount(dto?.amount);
    const date = this.validateDate(dto?.date);
    const financialAccountId = this.validateId(
      dto?.financialAccountId,
      'Financial account',
    );

    return this.prisma.$transaction(async (transaction) => {
      const [financialAccount, movementType] = await Promise.all([
        transaction.financialAccount.findUnique({
          where: { id: financialAccountId },
          select: { id: true },
        }),
        transaction.movementType.findUnique({ where: { code: 'ADJUSTMENT' } }),
      ]);

      if (!financialAccount) {
        throw new NotFoundException('Financial account not found');
      }
      if (!movementType) {
        throw new InternalServerErrorException(
          'Adjustment movement type is not configured',
        );
      }

      return transaction.movement.create({
        data: {
          financialAccountId,
          movementTypeId: movementType.id,
          date,
          amount,
        },
        include: { movementType: true },
      });
    });
  }

  async createIncome(dto: CreateIncomeDto) {
    const amount = this.validateAmount(dto?.amount);
    const date = this.validateDate(dto?.date);
    const financialAccountId = this.validateId(
      dto?.financialAccountId,
      'Financial account',
    );

    return this.prisma.$transaction(async (transaction) => {
      const [financialAccount, movementType] = await Promise.all([
        transaction.financialAccount.findUnique({
          where: { id: financialAccountId },
          select: { id: true },
        }),
        transaction.movementType.findUnique({ where: { code: 'INCOME' } }),
      ]);

      if (!financialAccount) {
        throw new NotFoundException('Financial account not found');
      }
      if (!movementType) {
        throw new InternalServerErrorException(
          'Income movement type is not configured',
        );
      }

      return transaction.movement.create({
        data: {
          financialAccountId,
          movementTypeId: movementType.id,
          date,
          amount,
        },
        include: { movementType: true },
      });
    });
  }

  async createTransfer(dto: CreateTransferDto) {
    const amount = this.validateAmount(dto?.amount);
    const date = this.validateDate(dto?.date);
    const sourceId = this.validateId(
      dto?.sourceFinancialAccountId,
      'Source financial account',
    );
    const destinationId = this.validateId(
      dto?.destinationFinancialAccountId,
      'Destination financial account',
    );

    if (sourceId === destinationId) {
      throw new BadRequestException(
        'Source and destination accounts must be different',
      );
    }

    return this.createPairedMovements({
      sourceId,
      destinationId,
      sourceAmount: amount,
      destinationAmount: amount,
      date,
      movementTypeCode: 'TRANSFER',
      requireSameCurrency: true,
    });
  }

  async createSale(dto: CreateSaleDto) {
    const sourceAmount = this.validateAmount(dto?.sourceAmount);
    const destinationAmount = this.validateAmount(dto?.destinationAmount);
    const date = this.validateDate(dto?.date);
    const sourceId = this.validateId(
      dto?.sourceFinancialAccountId,
      'Source financial account',
    );
    const destinationId = this.validateId(
      dto?.destinationFinancialAccountId,
      'Destination financial account',
    );

    if (sourceId === destinationId) {
      throw new BadRequestException(
        'Source and destination accounts must be different',
      );
    }

    return this.createPairedMovements({
      sourceId,
      destinationId,
      sourceAmount,
      destinationAmount,
      date,
      movementTypeCode: 'SALE',
      requireDifferentCurrency: true,
    });
  }

  private async createPairedMovements({
    sourceId,
    destinationId,
    sourceAmount,
    destinationAmount,
    date,
    movementTypeCode,
    requireSameCurrency = false,
    requireDifferentCurrency = false,
  }: {
    sourceId: string;
    destinationId: string;
    sourceAmount: number;
    destinationAmount: number;
    date: Date;
    movementTypeCode: 'TRANSFER' | 'SALE';
    requireSameCurrency?: boolean;
    requireDifferentCurrency?: boolean;
  }) {
    const operationId = randomUUID();

    return this.prisma.$transaction(async (transaction) => {
      const [accounts, movementType] = await Promise.all([
        transaction.financialAccount.findMany({
          where: { id: { in: [sourceId, destinationId] } },
          select: { id: true, currencyId: true },
        }),
        transaction.movementType.findUnique({
          where: { code: movementTypeCode },
        }),
      ]);

      if (accounts.length !== 2) {
        throw new NotFoundException('Financial account not found');
      }
      if (!movementType) {
        throw new InternalServerErrorException(
          `${movementTypeCode} movement type is not configured`,
        );
      }

      const sourceAccount = accounts.find(({ id }) => id === sourceId);
      const destinationAccount = accounts.find(
        ({ id }) => id === destinationId,
      );
      if (!sourceAccount || !destinationAccount) {
        throw new NotFoundException('Financial account not found');
      }
      if (
        requireSameCurrency &&
        sourceAccount.currencyId !== destinationAccount.currencyId
      ) {
        throw new BadRequestException(
          'Transfers require accounts with the same currency',
        );
      }
      if (
        requireDifferentCurrency &&
        sourceAccount.currencyId === destinationAccount.currencyId
      ) {
        throw new BadRequestException(
          'Sales require accounts with different currencies',
        );
      }

      return Promise.all([
        transaction.movement.create({
          data: {
            financialAccountId: sourceId,
            movementTypeId: movementType.id,
            operationId,
            date,
            amount: -sourceAmount,
          },
          include: { movementType: true },
        }),
        transaction.movement.create({
          data: {
            financialAccountId: destinationId,
            movementTypeId: movementType.id,
            operationId,
            date,
            amount: destinationAmount,
          },
          include: { movementType: true },
        }),
      ]);
    });
  }

  private validateAmount(amount: number) {
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be a positive number');
    }
    return amount;
  }

  private validateAdjustmentAmount(amount: number) {
    if (
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      amount === 0
    ) {
      throw new BadRequestException(
        'Adjustment amount must be a non-zero number',
      );
    }
    return amount;
  }

  private validateDate(date: string) {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Date must be a valid ISO date');
    }
    return parsedDate;
  }

  private validateId(id: string, label: string) {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new BadRequestException(`${label} id is required`);
    }
    return id;
  }
}
