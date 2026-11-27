import { Module } from '@nestjs/common';
import { BlueDollarRateController } from './blue-dollar-rate.controller';
import { BlueDollarRateService } from './blue-dollar-rate.service';

@Module({
  providers: [BlueDollarRateService],
  controllers: [BlueDollarRateController],
})
export class BlueDollarRateModule {}
