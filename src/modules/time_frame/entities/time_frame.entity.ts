import { Reservation } from 'src/modules/reservation/entities/reservation.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TimeFrame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  is_Active: boolean;

  @OneToOne(() => Reservation, (reservation) => reservation.timeframe)
  reservation: Reservation[];
}
