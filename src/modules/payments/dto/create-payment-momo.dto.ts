import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class createPaymentMomo {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Tổng số tiền không thể thiếu!' })
  amount: number;
}
