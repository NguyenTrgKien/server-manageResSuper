import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { TablesService } from '../tables/tables.service';
import { PaymentMethod } from '../payments/entities/payment.entity';
import { Table } from '../tables/entities/table.entity';
import { UsersService } from '../users/users.service';
import { Employess } from '../employees/entities/employees.entity';
import { User } from '../users/entities/user.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { nanoid } from 'nanoid';

export interface UserReponseJwt {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly tableService: TablesService,
    private readonly userService: UsersService,
    private dataSource: DataSource,
  ) {}
  async createOrder(dataCreateOrder: CreateOrderDto, user?: UserReponseJwt) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let table: Table | null = null;
      if (dataCreateOrder.tableId) {
        table = await this.tableService.findTableById(+dataCreateOrder.tableId);
        if (!table) {
          throw new BadRequestException('Không tìm thấy bàn!');
        }
      }
      if (user?.id) {
        const existUsing = await this.userService.findUserById(user?.id);
        if (!existUsing) {
          throw new BadRequestException('Người dùng không tồn tại!');
        }
      }
      const totalOrder = nanoid(6);
      const nextOrder = `DH_${totalOrder}`;

      const newOrderData = this.orderRepository.create({
        ...dataCreateOrder,
        table: table ?? undefined,
        order_code: nextOrder,
        payment_method: dataCreateOrder.payment_method ?? PaymentMethod.CASH,
        payment_status: dataCreateOrder.payment_status ?? PaymentStatus.UNPAID,
        order_status: dataCreateOrder.order_status ?? OrderStatus.PENDING,
      });

      if (user?.id) {
        if (user.role === 'staff') {
          newOrderData.employes = { id: user?.id } as Employess;
        } else {
          newOrderData.user = { id: user?.id } as User;
        }
      }
      await queryRunner.manager.save(Order, newOrderData);
      await queryRunner.commitTransaction();
      return {
        status: true,
        message: 'Tạo đơn hàng thành công!',
        order: newOrderData,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi không thể tạo đơn hàng!');
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderStatus(id: number, updateOrderStatus: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
    });
    if (!order) {
      throw new BadRequestException('Đơn hàng không tồn tại!');
    }

    order.order_status = updateOrderStatus.order_status;
    await this.orderRepository.save(order);
    return {
      status: true,
      message: 'Cập nhật trạng thái đơn hàng thành công!',
    };
  }

  async findOrderById(orderId: number) {
    return await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });
  }
}
