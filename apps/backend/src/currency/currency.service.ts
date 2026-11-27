import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';

@Injectable()
export class CurrencyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.currency.findMany({
      include: { currencyType: true },
      orderBy: { code: 'asc' },
    });
  }

  async findById(id: string) {
    const currency = await this.prisma.currency.findUnique({
      where: { id },
      include: { currencyType: true },
    });
    if (!currency) {
      throw new NotFoundException('Currency not found');
    }
    return currency;
  }

  async add(dto: CreateCurrencyDto) {
    const currencyTypeId = this.requiredString(dto?.currencyTypeId);
    const code = this.requiredString(dto?.code);
    const name = this.requiredString(dto?.name);
    const symbol = this.requiredString(dto?.symbol);

    const currencyType = await this.prisma.currencyType.findUnique({
      where: { id: currencyTypeId },
      select: { id: true },
    });
    if (!currencyType) {
      throw new NotFoundException('Currency type not found');
    }

    return this.prisma.currency.create({
      data: { currencyTypeId, code, name, symbol },
      include: { currencyType: true },
    });
  }

  async delete(id: string) {
    return this.prisma.currency.delete({ where: { id } });
  }

  private requiredString(value: unknown) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException('All currency fields are required');
    }
    return value.trim();
  }
}
