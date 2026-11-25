import { Module } from '@nestjs/common';
import { AccountHolderService } from './account-holder.service';
import { AccountHolderController } from './account-holder.controller';

@Module({
  providers: [AccountHolderService],
  controllers: [AccountHolderController]
})
export class AccountHolderModule {}
