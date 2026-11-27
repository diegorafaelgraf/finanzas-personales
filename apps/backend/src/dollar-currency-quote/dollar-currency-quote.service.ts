import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDollarCurrencyQuoteDto } from './dto/create-dollar-currency-quote.dto';

@Injectable()
export class DollarCurrencyQuoteService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.dollarCurrencyQuote.findMany({
      include: { currency: true },
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: string) {
    const quote = await this.prisma.dollarCurrencyQuote.findUnique({
      where: { id },
      include: { currency: true },
    });
    if (!quote) {
      throw new NotFoundException('Dollar currency quote not found');
    }
    return quote;
  }

  async add(dto: CreateDollarCurrencyQuoteDto) {
    const currencyId = dto?.currencyId;
    const date = new Date(dto?.date);
    const usdValue = dto?.usdValue;

    if (typeof currencyId !== 'string' || currencyId.trim().length === 0) {
      throw new BadRequestException('Currency id is required');
    }
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Date must be a valid ISO date');
    }
    if (
      typeof usdValue !== 'number' ||
      !Number.isFinite(usdValue) ||
      usdValue <= 0
    ) {
      throw new BadRequestException('USD value must be a positive number');
    }

    const currency = await this.prisma.currency.findUnique({
      where: { id: currencyId },
      select: { id: true },
    });
    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    return this.prisma.dollarCurrencyQuote.create({
      data: { currencyId, date, usdValue },
      include: { currency: true },
    });
  }

  async delete(id: string) {
    return this.prisma.dollarCurrencyQuote.delete({ where: { id } });
  }
}
