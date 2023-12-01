import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import OrderSchema, { Order } from './schema/order.schema';
import { BullModule } from '@nestjs/bull';
import { TgFileDownloaderConsumer } from './consumers/tg-file-downloader.consumer';
import { PrintConsumer } from './consumers/print.consumer';

@Module({
  controllers: [OrderController],
  providers: [OrderService, TgFileDownloaderConsumer, PrintConsumer],
  exports: [OrderService],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    BullModule.registerQueue({
      name: 'download_telegram_file',
    }),
    BullModule.registerQueue({
      name: 'print',
    }),
  ],
})
export class OrderModule {}
