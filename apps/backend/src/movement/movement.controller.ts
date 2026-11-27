import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { CreateIncomeDto } from './dto/create-income.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { MovementService } from './movement.service';

@Controller('movement')
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @Post('adjustment')
  createAdjustment(@Body() dto: CreateAdjustmentDto) {
    return this.movementService.createAdjustment(dto);
  }

  @Post('income')
  createIncome(@Body() dto: CreateIncomeDto) {
    return this.movementService.createIncome(dto);
  }

  @Post('transfer')
  createTransfer(@Body() dto: CreateTransferDto) {
    return this.movementService.createTransfer(dto);
  }

  @Post('sale')
  createSale(@Body() dto: CreateSaleDto) {
    return this.movementService.createSale(dto);
  }
}
