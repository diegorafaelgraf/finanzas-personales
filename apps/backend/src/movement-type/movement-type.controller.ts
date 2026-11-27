import { Controller, Get, Param } from '@nestjs/common';
import { MovementTypeService } from './movement-type.service';

@Controller('movement-type')
export class MovementTypeController {
  constructor(private readonly movementTypeService: MovementTypeService) {}

  @Get()
  findAll() {
    return this.movementTypeService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.movementTypeService.findById(id);
  }
}
