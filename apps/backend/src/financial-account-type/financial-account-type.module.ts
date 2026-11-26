import { Module } from '@nestjs/common';
import { FinancialAccountTypeController } from './financial-account-type.controller';
import { FinancialAccountTypeService } from './financial-account-type.service';

@Module({
  providers: [FinancialAccountTypeService],
  controllers: [FinancialAccountTypeController],
})
export class FinancialAccountTypeModule {}
