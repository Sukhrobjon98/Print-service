import { Injectable } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { InjectModel } from '@nestjs/mongoose';
import { Client, ClientDocument } from './schema/client.schema';
import { Model } from 'mongoose';
import { CreateClientData } from './dto/create-client-data';

@Injectable()
export class ClientService {
  constructor(
    private readonly orderService: OrderService,
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
  ) {}

  createClient(data: CreateClientData) {
    return this.clientModel.create(data);
  }

  async hasTelegramUser(telegramId: number): Promise<boolean> {
    const exists = await this.clientModel.exists({
      telegramId,
    });

    return exists !== null;
  }

  async getClientByTelegramId(telegramId: number): Promise<ClientDocument> {
    return this.clientModel.findOne(
      {
        telegramId,
      },
      {
        _id: 1,
      },
    );
  }

  createOrder() {
    // logic here
    // hammasi yaxshi
    // return this.orderService.createOrder();
  }
}
