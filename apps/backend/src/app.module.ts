import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AccountHolderModule } from './account-holder/account-holder.module';

@Module({
  imports: [PrismaModule, AccountHolderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
