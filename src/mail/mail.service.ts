import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailPaymentSuccess(
    user: User | null,
    order: Order,
    payment: Payment,
  ) {
    try {
      await this.mailerService.sendMail({
        to: user?.email,
        subject: 'Thanh toán đơn hàng thành công!',
        template: 'payment-success', // Tên template dùng để render nội dung email
        context: {
          // Các biến sẽ truyền vào template
          email: user?.email ?? order.customer_phone,
          customerName: user?.username ?? order.customer_name,
          orderId: order.order_code,
          orderDate: order.created_at,
          paymentMethod: payment.payment_method,
          totalAmount: payment.amount,
          supportEmail: 'nguyentrungkien040921@gmail.com',
          supportPhone: '0357124853',
        },
      });
      return {
        status: true,
        message: 'Gửi mail thành công!',
      };
    } catch (error) {
      console.log('Gửi email không thành công!', error);
    }
  }

  async sendEmailForgotPassword(user: User, token: string) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Đây là mã xác thực để cấp lại mật khẩu!',
        template: 'forgot-password',
        context: {
          name: user.username,
          otp: token,
          expiryMinutes: '1',
        },
      });
      return {
        status: true,
        message: 'Gửi email thành công!',
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Lỗi không thể gửi email!',
      };
    }
  }
}
