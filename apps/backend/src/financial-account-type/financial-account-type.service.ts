import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddFinancialAccountTypeDto } from './dto/add-financial-account-type.dto';

@Injectable()
export class FinancialAccountTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.financialAccountType.findMany();
  }

  async findById(id: string) {
    const financialAccountType =
      await this.prisma.financialAccountType.findUnique({
        where: { id },
      });

    if (!financialAccountType) {
      throw new NotFoundException('Financial account type not found');
    }

    return financialAccountType;
  }

  async add(addFinancialAccountTypeDto: AddFinancialAccountTypeDto) {
    const name = addFinancialAccountTypeDto?.name;
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new BadRequestException('Name must be a non-empty string');
    }

    return this.prisma.financialAccountType.create({
      data: { name: name.trim() },
    });
  }

  async delete(id: string) {
    return this.prisma.financialAccountType.delete({
      where: { id },
    });
  }
}
