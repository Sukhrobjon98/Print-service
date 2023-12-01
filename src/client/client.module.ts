import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { OrderModule } from '../order/order.module';
import { MongooseModule } from '@nestjs/mongoose';
import ClientSchema, { Client } from './schema/client.schema';

@Module({
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService],
  imports: [
    OrderModule,
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
})
export class ClientModule {}
