import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateCurrencyTypeDto } from './dto/create-currency-type.dto';
import { CurrencyTypeService } from './currency-type.service';

@Controller('currency-type')
export class CurrencyTypeController {
  constructor(private readonly currencyTypeService: CurrencyTypeService) {}

  @Get()
  findAll() {
    return this.currencyTypeService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.currencyTypeService.findById(id);
  }

  @Post()
  add(@Body() dto: CreateCurrencyTypeDto) {
    return this.currencyTypeService.add(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.currencyTypeService.delete(id);
  }
}
