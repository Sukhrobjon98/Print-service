import { OrderSource } from '../schema/order.schema';

export default class CreateOrderData {
  title?: string;
  price?: number;
  client: string;
  source: OrderSource;
  tgFileId?: string;
}
