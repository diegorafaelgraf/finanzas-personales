import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountHolderDto } from './dto/create-account-holder.dto';

@Injectable()
export class AccountHolderService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.accountHolder.findMany();
  }

  async create(createAccountHolderDto: CreateAccountHolderDto) {
    const name = createAccountHolderDto?.name;
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new BadRequestException('Name must be a non-empty string');
    }

    return this.prisma.accountHolder.create({
      data: { name: name.trim() },
    });
  }

  async remove(id: string) {
    return this.prisma.accountHolder.delete({
      where: { id },
    });
  }
}
