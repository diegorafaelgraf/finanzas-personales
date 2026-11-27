import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateBlueDollarRateDto } from './dto/create-blue-dollar-rate.dto';
import { BlueDollarRateService } from './blue-dollar-rate.service';

@Controller('blue-dollar-rate')
export class BlueDollarRateController {
  constructor(private readonly blueDollarRateService: BlueDollarRateService) {}

  @Get()
  findAll() {
    return this.blueDollarRateService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.blueDollarRateService.findById(id);
  }

  @Post()
  add(@Body() dto: CreateBlueDollarRateDto) {
    return this.blueDollarRateService.add(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.blueDollarRateService.delete(id);
  }
}
