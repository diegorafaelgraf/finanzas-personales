import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinancialAccountDto } from './dto/create-financial-account.dto';

@Injectable()
export class FinancialAccountService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.financialAccount.findMany({
      include: {
        accountHolder: true,
        financialAccountType: true,
        currency: true,
      },
    });
  }

  async findById(id: string) {
    const financialAccount = await this.prisma.financialAccount.findUnique({
      where: { id },
      include: {
        accountHolder: true,
        financialAccountType: true,
        currency: true,
      },
    });
    if (!financialAccount) {
      throw new NotFoundException('Financial account not found');
    }
    return financialAccount;
  }

  async add(dto: CreateFinancialAccountDto) {
    const accountHolderId = this.requiredId(dto?.accountHolderId);
    const financialAccountTypeId = this.requiredId(dto?.financialAccountTypeId);
    const currencyId = this.requiredId(dto?.currencyId);

    const [accountHolder, financialAccountType, currency] = await Promise.all([
      this.prisma.accountHolder.findUnique({
        where: { id: accountHolderId },
        select: { id: true },
      }),
      this.prisma.financialAccountType.findUnique({
        where: { id: financialAccountTypeId },
        select: { id: true },
      }),
      this.prisma.currency.findUnique({
        where: { id: currencyId },
        select: { id: true },
      }),
    ]);

    if (!accountHolder) {
      throw new NotFoundException('Account holder not found');
    }
    if (!financialAccountType) {
      throw new NotFoundException('Financial account type not found');
    }
    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    return this.prisma.financialAccount.create({
      data: { accountHolderId, financialAccountTypeId, currencyId },
      include: {
        accountHolder: true,
        financialAccountType: true,
        currency: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.financialAccount.delete({ where: { id } });
  }

  private requiredId(value: unknown) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException('All financial account ids are required');
    }
    return value;
  }
}
