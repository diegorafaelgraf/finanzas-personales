import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AccountHolderModule } from './account-holder/account-holder.module';
import { PrismaExceptionFilter } from './common/filters/prisma/exception.filter';
import { FinancialAccountTypeModule } from './financial-account-type/financial-account-type.module';
import { CategoryModule } from './category/category.module';
import { ExpenseModule } from './expense/expense.module';
import { MovementModule } from './movement/movement.module';

@Module({
  imports: [
    PrismaModule,
    AccountHolderModule,
    FinancialAccountTypeModule,
    CategoryModule,
    ExpenseModule,
    MovementModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
