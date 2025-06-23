import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ!' })
  @IsNotEmpty({ message: 'Trạng thái không được bỏ trống!' })
  order_status: OrderStatus;
}
