import { Body, Controller, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserReponseJwt } from '../orders/orders.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('/create-payment')
  createPaymennt(
    @Body() dataCreatePayment: CreatePaymentDto,
    @Req() req: { user: UserReponseJwt },
  ) {
    const user = req.user;
    return this.paymentsService.createPayment(dataCreatePayment, user);
  }
}
