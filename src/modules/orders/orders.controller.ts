import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { OrdersService, UserReponseJwt } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/create-order')
  createOrder(
    @Body() dataCreateOrder: CreateOrderDto,
    @Request() req: { user: UserReponseJwt },
  ) {
    const user = req.user;
    return this.ordersService.createOrder(dataCreateOrder, user);
  }

  @Patch('/update-order-status/:id')
  @Public()
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number, // Dùng để chuyển id thành một số
    @Body()
    udpateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, udpateOrderStatusDto);
  }
}
