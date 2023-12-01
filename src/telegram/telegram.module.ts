import { Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { ClientModule } from '../client/client.module';
import { OrderModule } from '../order/order.module';

@Module({
  providers: [TelegramUpdate],
  imports: [ClientModule, OrderModule],
})
export default class TelegramModule {}
