import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import CreateOrderBody from './dto/create-order-body.dto';
import { OrderSource } from './schema/order.schema';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('all')
  allOrders() {
    return this.orderService.allOrders();
  }

  @Get('/:id')
  getOrder(@Param('id') id: string) {
    return id;
  }

  @Post('/')
  createOrder(@Body() data: CreateOrderBody) {
    return this.orderService.createOrder({
      ...data,
      source: OrderSource.Web,
    });
  }
}
