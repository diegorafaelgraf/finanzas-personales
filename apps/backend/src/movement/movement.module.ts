import { Module } from '@nestjs/common';
import { MovementController } from './movement.controller';
import { MovementService } from './movement.service';

@Module({
  providers: [MovementService],
  controllers: [MovementController],
})
export class MovementModule {}
