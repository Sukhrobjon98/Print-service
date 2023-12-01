import { Module } from '@nestjs/common';
import { ClientModule } from '../client/client.module';
import { OrderModule } from '../order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';
import TelegramModule from '../telegram/telegram.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ClientModule,
    OrderModule,
    TelegrafModule.forRoot({
      token: '5599479580:AAHuk3oVQmvmY7LH_WZRbwy9QykfSfgMWGo',
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 16379,
      },
    }),
    TelegramModule,
    MongooseModule.forRoot('mongodb://user:pass@127.0.0.1:37017', {
      dbName: 'printservice',
    }),
  ],
})
export class AppModule {}
