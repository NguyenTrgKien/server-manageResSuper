import { Employess } from 'src/modules/employees/entities/employees.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Table } from 'src/modules/tables/entities/table.entity';
import { TimeFrame } from 'src/modules/time_frame/entities/time_frame.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ type: 'timestamp' })
  reservation_date: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  reservation_status: ReservationStatus;

  @Column()
  customer_name: string;

  @Column()
  customer_phone: string;

  @Column()
  note: string;

  @Column({ type: 'int' })
  number_of_people: number;

  @ManyToOne(() => User, (user) => user.reservation)
  user: User;

  @ManyToOne(() => Table, (table) => table.reservation)
  table: Table;

  @ManyToOne(() => TimeFrame, (timeframe) => timeframe.reservation)
  timeframe: TimeFrame;

  @OneToMany(() => Order, (order) => order.reservation)
  orders: Order[];

  @ManyToOne(() => Employess, (employee) => employee.reservation)
  employee: Employess;
}
