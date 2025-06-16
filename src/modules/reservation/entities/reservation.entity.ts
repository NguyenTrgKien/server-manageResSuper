import { Table } from 'src/modules/tables/entities/table.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  reservation_code: string;

  @Column({ type: 'date' })
  reservation_date: Date;

  @Column({ type: 'timestamp' })
  reservation_time: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  reservation_status: ReservationStatus;

  @Column()
  note: string;

  @ManyToOne(() => User, (user) => user.reservation)
  user: User;

  @ManyToOne(() => Table, (table) => table.reservation)
  table: Table;
}
