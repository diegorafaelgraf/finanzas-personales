import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AccountHolderService } from './account-holder.service';
import { CreateAccountHolderDto } from './dto/create-account-holder.dto';

@Controller('account-holder')
export class AccountHolderController {
  constructor(private readonly accountHolderService: AccountHolderService) {}

  @Get()
  findAll() {
    return this.accountHolderService.findAll();
  }

  @Post()
  create(@Body() createAccountHolderDto: CreateAccountHolderDto) {
    return this.accountHolderService.create(createAccountHolderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountHolderService.remove(id);
  }
}
