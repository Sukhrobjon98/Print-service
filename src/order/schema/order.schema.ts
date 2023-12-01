import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Client } from '../../client/schema/client.schema';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  New = 0,
  InProcess = 1,
  Delivering = 2,
  Delivered = 3,
  Canceled = -1,
}

export enum OrderSource {
  Telegram = 0,
  Web = 1,
}

@Schema({
  timestamps: true,
})
export class Order {
  @Prop({ type: String, required: false })
  title?: string;

  @Prop({ type: Number, required: false })
  price?: number;

  @Prop({ type: Number, enum: OrderStatus, default: OrderStatus.New })
  status: OrderStatus;

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  client: Types.ObjectId;

  @Prop({ type: Number, enum: OrderSource, default: OrderSource.Web })
  source: OrderSource;

  @Prop({ type: String, required: false })
  tgFileId?: string;

  @Prop({ type: String, required: false })
  path?: string;
}

const OrderSchema = SchemaFactory.createForClass(Order);

export default OrderSchema;
