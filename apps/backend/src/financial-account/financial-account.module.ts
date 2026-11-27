import { Module } from '@nestjs/common';
import { FinancialAccountController } from './financial-account.controller';
import { FinancialAccountService } from './financial-account.service';

@Module({
  providers: [FinancialAccountService],
  controllers: [FinancialAccountController],
})
export class FinancialAccountModule {}
