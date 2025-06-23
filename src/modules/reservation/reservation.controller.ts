import { Controller, Post, Body, Req, Patch } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UserReponseJwt } from '../orders/orders.service';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('/create-reservation')
  createReservation(
    @Body() dataCreateReservation: CreateReservationDto,
    @Req() req: { user: UserReponseJwt },
  ) {
    const infoUser = req.user;
    return this.reservationService.createReservation(
      dataCreateReservation,
      infoUser,
    );
  }

  @Patch('/update-reservation-status')
  updateReservationStatus(@Body() reservationUpdate: UpdateReservationDto) {
    return this.reservationService.updateReservationStatus(reservationUpdate);
  }
}
