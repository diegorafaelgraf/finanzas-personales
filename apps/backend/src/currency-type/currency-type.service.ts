import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCurrencyTypeDto } from './dto/create-currency-type.dto';

@Injectable()
export class CurrencyTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.currencyType.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string) {
    const currencyType = await this.prisma.currencyType.findUnique({
      where: { id },
    });
    if (!currencyType) {
      throw new NotFoundException('Currency type not found');
    }
    return currencyType;
  }

  async add(dto: CreateCurrencyTypeDto) {
    const name = dto?.name;
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new BadRequestException('Name must be a non-empty string');
    }
    return this.prisma.currencyType.create({
      data: { name: name.trim() },
    });
  }

  async delete(id: string) {
    return this.prisma.currencyType.delete({ where: { id } });
  }
}
