import { Type } from 'class-transformer';
import {
  OrderStatus,
  OrderType,
  PaymentStatus,
} from '../entities/order.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { PaymentMethod } from 'src/modules/payments/entities/payment.entity';

export class CreateOrderDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  tableId?: number;

  @IsEnum(OrderType, { message: 'Kiểu đăt hàng không hợp lệ!' })
  @IsNotEmpty({ message: 'Kiểu đặt hàng không thể thiếu!' })
  order_type: OrderType;

  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ!' })
  @IsOptional()
  order_status: OrderStatus;

  @IsString()
  @IsOptional()
  customer_name: string;

  @IsString()
  @IsOptional()
  customer_phone: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Tổng tiền đơn hàng không được thiếu!' })
  total_amount: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @ValidateIf((o: CreateOrderDto) => o.order_type === OrderType.TAKEAWAY)
  @IsNotEmpty({ message: 'Địa chỉ là bắt buộc khi giao hàng!' })
  address: string;

  @IsEnum(PaymentStatus, { message: 'Trạng thái thanh toán không hợp lệ!' })
  @IsOptional()
  payment_status: PaymentStatus;

  @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán không hợp lệ!' })
  @IsOptional()
  payment_method: PaymentMethod;
}
