import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.currencyService.findById(id);
  }

  @Post()
  add(@Body() dto: CreateCurrencyDto) {
    return this.currencyService.add(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.currencyService.delete(id);
  }
}
