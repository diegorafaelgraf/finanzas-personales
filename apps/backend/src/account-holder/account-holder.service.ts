import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountHolderService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.accountHolder.findMany();
  }
}