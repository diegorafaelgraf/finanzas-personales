import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateDollarCurrencyQuoteDto } from './dto/create-dollar-currency-quote.dto';
import { DollarCurrencyQuoteService } from './dollar-currency-quote.service';

@Controller('dollar-currency-quote')
export class DollarCurrencyQuoteController {
  constructor(
    private readonly dollarCurrencyQuoteService: DollarCurrencyQuoteService,
  ) {}

  @Get()
  findAll() {
    return this.dollarCurrencyQuoteService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.dollarCurrencyQuoteService.findById(id);
  }

  @Post()
  add(@Body() dto: CreateDollarCurrencyQuoteDto) {
    return this.dollarCurrencyQuoteService.add(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dollarCurrencyQuoteService.delete(id);
  }
}
