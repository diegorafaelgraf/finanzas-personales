import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateFinancialAccountDto } from './dto/create-financial-account.dto';
import { FinancialAccountService } from './financial-account.service';

@Controller('financial-account')
export class FinancialAccountController {
  constructor(
    private readonly financialAccountService: FinancialAccountService,
  ) {}

  @Get()
  findAll() {
    return this.financialAccountService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.financialAccountService.findById(id);
  }

  @Post()
  add(@Body() dto: CreateFinancialAccountDto) {
    return this.financialAccountService.add(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.financialAccountService.delete(id);
  }
}
