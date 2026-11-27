import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlueDollarRateDto } from './dto/create-blue-dollar-rate.dto';

@Injectable()
export class BlueDollarRateService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.blueDollarRate.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: string) {
    const rate = await this.prisma.blueDollarRate.findUnique({
      where: { id },
    });
    if (!rate) {
      throw new NotFoundException('Blue dollar rate not found');
    }
    return rate;
  }

  async add(dto: CreateBlueDollarRateDto) {
    const date = new Date(dto?.date);
    const usdArsBuy = dto?.usdArsBuy;

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Date must be a valid ISO date');
    }
    if (
      typeof usdArsBuy !== 'number' ||
      !Number.isFinite(usdArsBuy) ||
      usdArsBuy <= 0
    ) {
      throw new BadRequestException('Buy rate must be a positive number');
    }

    return this.prisma.blueDollarRate.create({
      data: { date, usdArsBuy },
    });
  }

  async delete(id: string) {
    return this.prisma.blueDollarRate.delete({ where: { id } });
  }
}
