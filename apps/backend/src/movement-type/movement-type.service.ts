import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MovementTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.movementType.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async findById(id: string) {
    const movementType = await this.prisma.movementType.findUnique({
      where: { id },
    });
    if (!movementType) {
      throw new NotFoundException('Movement type not found');
    }
    return movementType;
  }
}
