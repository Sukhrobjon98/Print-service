import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientBody } from './dto/create-client-body.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('create-order')
  createOrder() {
    return this.clientService.createOrder();
  }

  @Post('/')
  createClient(@Body() data: CreateClientBody) {
    return this.clientService.createClient(data);
  }
}
