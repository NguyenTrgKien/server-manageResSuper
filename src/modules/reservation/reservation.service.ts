import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { DataSource, Repository } from 'typeorm';
import { OrdersService, UserReponseJwt } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Employess } from '../employees/entities/employees.entity';
import { Order } from '../orders/entities/order.entity';
import { v4 as uuidv4 } from 'uuid';
import { TablesService } from '../tables/tables.service';
import { TimeFrameService } from '../time_frame/time_frame.service';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly userService: UsersService,
    private readonly orderService: OrdersService,
    private readonly tableService: TablesService,
    private readonly timeframeService: TimeFrameService,
    private dataSource: DataSource,
  ) {}
  async createReservation(
    createReservationDto: CreateReservationDto,
    user?: UserReponseJwt,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { tableId } = createReservationDto;
      const table = await this.tableService.findTableById(tableId);
      if (!table) {
        throw new BadRequestException('Không tìm thấy bàn này!');
      }

      const timeframe = await this.timeframeService.findTimeframeById(
        createReservationDto.timeframeId,
      );
      if (!timeframe) {
        throw new BadRequestException('Không tìm thấy khung giờ này!');
      }

      const { reservation_date } = createReservationDto;
      const conflict = await this.reservationRepository.findOne({
        where: {
          table: { id: table.id },
          timeframe: { id: timeframe.id },
          reservation_date: new Date(reservation_date),
        },
      });
      if (conflict) {
        throw new BadRequestException(
          'Bàn này đã được đặt trong khung giờ bạn đã chọn!',
        );
      }

      let existUsing: User | null = null;
      if (user?.id) {
        existUsing = await this.userService.findUserById(user?.id);
        if (!existUsing) {
          throw new BadRequestException('Không tìm thấy tài khoản người dùng!');
        }
      }
      const totalReservation = uuidv4();
      const nextReservation = `DB_${totalReservation}`;
      const newReservationData = this.reservationRepository.create({
        ...createReservationDto,
        reservation_code: nextReservation,
        reservation_status: ReservationStatus.PENDING,
        note: createReservationDto.note || '',
        customer_name: createReservationDto.customer_name || '',
        customer_phone: createReservationDto.customer_phone || '',
        table: { id: createReservationDto.tableId },
        timeframe: timeframe,
      });

      if (user?.id) {
        if (user.role === 'staff') {
          newReservationData.employee = { id: user.id } as Employess;
        } else {
          newReservationData.user = { id: user.id } as User;
        }
      }
      const savedReservation =
        await queryRunner.manager.save(newReservationData);
      if (
        createReservationDto.orderIds &&
        createReservationDto.orderIds.length > 0
      ) {
        await Promise.all(
          // Ném lỗi nếu bất kì hàm async nào lỗi
          createReservationDto.orderIds.map(async (orderId) => {
            const order = await this.orderService.findOrderById(orderId);
            if (!order) {
              throw new BadRequestException(
                `Không tìm thấy order với ID ${orderId}`,
              );
            }
          }),
        );
        await Promise.all(
          createReservationDto.orderIds.map(async (orderId) => {
            await queryRunner.manager.update(Order, orderId, {
              reservation: savedReservation,
            });
          }),
        );
      }
      await queryRunner.commitTransaction();
      return {
        status: true,
        message: 'Tạo đơn đặt bàn thành công!',
        reservation: savedReservation,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi không thể tạo đơn đặt bàn này!',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateReservationStatus(reservationUpdate: UpdateReservationDto) {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: {
          id: reservationUpdate.id,
        },
      });
      if (!reservation) {
        throw new BadRequestException('Không tìm thấy đơn hàng này!');
      }
      await this.reservationRepository.update(reservation.id, {
        reservation_status: reservationUpdate.reservation_status,
      });
      return {
        status: true,
        message: 'Cập nhật đơn đặt bàn thành công!',
      };
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi không thể cập nhật đơn hàng!',
      );
    }
  }
}
