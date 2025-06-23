import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { TablesModule } from '../tables/tables.module';
import { ReservationScheduler } from './reservation.schedule';
import { TimeFrameModule } from '../time_frame/time_frame.module';
import { Table } from '../tables/entities/table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Table]),
    UsersModule,
    OrdersModule,
    TablesModule,
    TimeFrameModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationScheduler],
})
export class ReservationModule {}
