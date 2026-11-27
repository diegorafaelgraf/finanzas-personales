import { Module } from '@nestjs/common';
import { DollarCurrencyQuoteController } from './dollar-currency-quote.controller';
import { DollarCurrencyQuoteService } from './dollar-currency-quote.service';

@Module({
  providers: [DollarCurrencyQuoteService],
  controllers: [DollarCurrencyQuoteController],
})
export class DollarCurrencyQuoteModule {}
