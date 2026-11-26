import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddFinancialAccountTypeDto } from './dto/add-financial-account-type.dto';
import { FinancialAccountTypeService } from './financial-account-type.service';

@Controller('financial-account-type')
export class FinancialAccountTypeController {
  constructor(
    private readonly financialAccountTypeService: FinancialAccountTypeService,
  ) {}

  @Get()
  findAll() {
    return this.financialAccountTypeService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.financialAccountTypeService.findById(id);
  }

  @Post()
  add(@Body() addFinancialAccountTypeDto: AddFinancialAccountTypeDto) {
    return this.financialAccountTypeService.add(addFinancialAccountTypeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.financialAccountTypeService.delete(id);
  }
}
