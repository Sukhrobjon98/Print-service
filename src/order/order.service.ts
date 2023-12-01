import { Injectable } from '@nestjs/common';
import CreateOrderData from './dto/create-order-data';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument, OrderSource } from './schema/order.schema';
import { Model, Types } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import DownloadTgFileQueue from './dto/queue/download-tg-file.queue';
import PrintFileQueue from './dto/queue/print-file.queue';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectQueue('download_telegram_file') private downloadTgQueue: Queue,
    @InjectQueue('print') private printQueue: Queue,
  ) {}

  async createOrder(data: CreateOrderData) {
    const { client, ...rest } = data;

    const order = await this.orderModel.create({
      ...rest,
      client: new Types.ObjectId(client),
    });

    if (order.source === OrderSource.Telegram) {
      await this.downloadTgQueue.add({
        orderId: order._id.toHexString(),
        fileId: order.tgFileId,
      } as DownloadTgFileQueue);
    } else {
      await this.printQueue.add({
        orderId: order._id.toHexString(),
        path: order.path,
      } as PrintFileQueue);
    }

    return order;
  }

  async allOrders() {
    return this.orderModel
      .find(
        {},
        {
          title: 1,
          price: 1,
        },
      )
      .sort({
        createdAt: -1,
      })
      .populate('client', {
        name: 1,
      });
  }
}
