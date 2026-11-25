import { Controller, Get } from '@nestjs/common';
import { AccountHolderService } from './account-holder.service';

@Controller('account-holder')
export class AccountHolderController {
  constructor(private readonly accountHolderService: AccountHolderService) {}

  @Get()
  findAll() {
    return this.accountHolderService.findAll();
  }
}