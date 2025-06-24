import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { DataSource, Repository } from 'typeorm';
import { OrdersService, UserReponseJwt } from '../orders/orders.service';
import { nanoid } from 'nanoid';
import { UsersService } from '../users/users.service';
import { Employess } from '../employees/entities/employees.entity';
import { User } from '../users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { MomoService } from '../momo/momo.service';
import { createPaymentMomo } from './dto/create-payment-momo.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly orderService: OrdersService,
    private readonly userService: UsersService,
    private readonly mailService: MailService,
    private readonly momoService: MomoService,
    private dataSource: DataSource,
  ) {}
  async createPayment(
    dataCreatePayment: CreatePaymentDto,
    user?: UserReponseJwt,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { orderId } = dataCreatePayment;
      const existingPayment = await this.paymentRepository.findOne({
        where: {
          order: { id: orderId },
        },
      });
      if (existingPayment) {
        throw new BadRequestException('Đơn hàng này được dược thanh toán!');
      }
      const order = await this.orderService.findOrderById(orderId);
      if (!order) {
        throw new BadRequestException('Không tìm thấy đơn hàng này!');
      }
      const nextPaymentCode = `TT_${nanoid(6)}`;

      const change =
        +dataCreatePayment.received_amount - +dataCreatePayment.amount;
      if (change < 0) {
        throw new BadRequestException('Khách chưa trả đủ số tiền!');
      }
      const newPayment = this.paymentRepository.create({
        ...dataCreatePayment,
        payment_code: nextPaymentCode,
        payment_method: dataCreatePayment.payment_method,
        amount: dataCreatePayment.amount,
        order: { id: dataCreatePayment.orderId },
        change_amount: change > 0 ? change : 0,
      });

      let existUsing: User | null = null;
      if (user?.id) {
        existUsing = await this.userService.findUserById(user.id);
        if (!existUsing) {
          throw new BadRequestException('Tài khoản người dung không tồn tại!');
        }
        if (user.role === 'staff') {
          newPayment.employes = { id: user.id } as Employess;
        } else {
          newPayment.user = { id: user.id } as User;
        }
      }
      newPayment.payment_status = PaymentStatus.PAID;

      await queryRunner.manager.save(Payment, newPayment);
      await queryRunner.commitTransaction();

      if (user?.id) {
        const sendEmail = await this.mailService.sendEmailPaymentSuccess(
          existUsing,
          order,
          newPayment,
        );
        console.log(sendEmail);
      }

      return {
        status: true,
        message: 'Tạo thanh toán thành công!',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Lỗi không thể tạo thanh toán!');
    } finally {
      await queryRunner.release();
    }
  }
  async createPaymentWithMomo(dataCreatePaymentMomo: createPaymentMomo) {
    return await this.momoService.createPaymentWithMomo(
      dataCreatePaymentMomo.amount,
    );
  }
  callbackPaymentMomo(dataCallback: unknown) {
    console.log(dataCallback);
    return {
      message: 'Giao dịch thành công!',
    };
  }
}
