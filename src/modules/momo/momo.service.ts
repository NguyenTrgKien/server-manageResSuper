import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import axios, { AxiosResponse } from 'axios';

export interface MomoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  resultCode: number;
  message: string;
  payUrl: string;
  deeplink?: string; // Tùy chọn, không phải lúc nào cũng có
  qrCodeUrl?: string; // Tùy chọn, không phải lúc nào cũng có
}

@Injectable()
export class MomoService {
  private readonly accessKey = 'F8BBA842ECF85';
  private readonly secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  private readonly orderInfo = 'pay with MoMo';
  private readonly partnerCode = 'MOMO';
  private readonly redirectUrl =
    'https://d047-171-246-74-76.ngrok-free.app/payments/return'; // Chuyển hướng đến trang khi người dùng hoàn tất thanh toán để hiển thị thanh toán thành công hay thất bại
  private readonly ipnUrl =
    'https://d047-171-246-74-76.ngrok-free.app/api/v1/payments/callback-payment-momo'; // Thông báo trạng thái cho backend biết thành công hay thất bại
  private readonly requestType = 'payWithMethod';
  private readonly extraData = '';
  private readonly orderGroupId = '';
  private readonly autoCapture = true;
  private readonly lang = 'vi';
  private readonly endpoint =
    'https://test-payment.momo.vn/v2/gateway/api/create';

  async createPaymentWithMomo(amount: number) {
    try {
      const timestamp = new Date().getTime();
      const orderId = 'ORDER_' + timestamp;
      const requestId = 'REQ_' + timestamp;
      // Tạo chữ kí theo định dạng của momo
      const rawSignature =
        'accessKey=' +
        this.accessKey +
        '&amount=' +
        amount +
        '&extraData=' +
        this.extraData +
        '&ipnUrl=' +
        this.ipnUrl +
        '&orderId=' +
        orderId +
        '&orderInfo=' +
        this.orderInfo +
        '&partnerCode=' +
        this.partnerCode +
        '&redirectUrl=' +
        this.redirectUrl +
        '&requestId=' +
        requestId +
        '&requestType=' +
        this.requestType;

      // Cấu hình băm chữ kí
      const signature = crypto
        .createHmac('sha256', this.secretKey)
        .update(rawSignature)
        .digest('hex');

      // Tạo một object dữ liệu để gửi đến momo
      const requestBody = JSON.stringify({
        partnerCode: this.partnerCode,
        partnerName: 'Test',
        storeId: 'MomoTestStore',
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: this.orderInfo,
        redirectUrl: this.redirectUrl,
        ipnUrl: this.ipnUrl,
        lang: this.lang,
        requestType: this.requestType,
        autoCapture: this.autoCapture,
        extraData: this.extraData,
        orderGroupId: this.orderGroupId,
        signature: signature,
      });

      const response: AxiosResponse<MomoPaymentResponse> = await axios.post(
        this.endpoint,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Tạo thanh toán momo không thành công!',
      );
    }
  }
}
