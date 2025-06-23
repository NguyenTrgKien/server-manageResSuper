// src/modules/reservation/reservation.scheduler.ts

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { Table, TableStatus } from '../tables/entities/table.entity';

@Injectable()
export class ReservationScheduler {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Table)
    private readonly tableRepo: Repository<Table>,
  ) {}

  // Chạy mỗi phút: kiểm tra bàn cần chuyển sang trạng thái
  @Cron('*/2 * * * *') // Every 2 minute
  async handleTableStatusUpdate() {
    const now = new Date();

    // Tìm các đơn CONFIRMED đang đến giờ bắt đầu
    const reservations = await this.reservationRepo.find({
      where: {
        reservation_status: ReservationStatus.CONFIRMED, // Tìm các đơn đã xác nhận
      },
      relations: ['table', 'timeframe'],
    });

    for (const reservation of reservations) {
      const { table, timeframe } = reservation;

      if (
        timeframe &&
        new Date(timeframe.start_time) <= now &&
        new Date(timeframe.end_time) >= now &&
        table.table_status !== TableStatus.OCCUPIED
      ) {
        table.table_status = TableStatus.OCCUPIED;
        await this.tableRepo.save(table);
      }
    }
  }
}
