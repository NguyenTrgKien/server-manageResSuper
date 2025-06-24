import { Body, Controller, Post, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserReponseJwt } from '../orders/orders.service';
import { createPaymentMomo } from './dto/create-payment-momo.dto';
import { MomoPaymentResponse } from '../momo/momo.service';

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

  @Post('/momo')
  createPaymentWithMomo(
    @Body() dataCreatePaymentMomo: createPaymentMomo,
  ): Promise<MomoPaymentResponse> {
    return this.paymentsService.createPaymentWithMomo(dataCreatePaymentMomo);
  }

  @Post('/return')
  return(@Body() data) {
    console.log(data);
    return {
      message: 'Thành công!',
    };
  }

  @Post('/callback-payment-momo')
  callbackPaymentMomo(@Body() dataCallback: unknown) {
    console.log(dataCallback);
    return this.paymentsService.callbackPaymentMomo(dataCallback);
  }
}
