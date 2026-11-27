import { Module } from '@nestjs/common';
import { MovementTypeController } from './movement-type.controller';
import { MovementTypeService } from './movement-type.service';

@Module({
  providers: [MovementTypeService],
  controllers: [MovementTypeController],
})
export class MovementTypeModule {}
