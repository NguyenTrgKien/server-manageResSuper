import { Order } from 'src/modules/orders/entities/order.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { Reservation } from 'src/modules/reservation/entities/reservation.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum EmployesStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
}

@Entity()
export class Employess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  employes_code: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  birth_day: string;

  @Column({ type: 'int' })
  salary: number;

  @Column()
  avatar: string;

  @Column({
    type: 'enum',
    enum: EmployesStatus,
    default: EmployesStatus.ACTIVE,
  })
  status: string;

  @Column({ nullable: true })
  publicId: string;

  @OneToOne(() => User, (user) => user.employes)
  @JoinColumn()
  user: User;

  @OneToMany(() => Order, (order) => order.employes)
  order: Order[];

  @OneToMany(() => Payment, (payment) => payment.employes)
  payment: Payment[];

  @OneToMany(() => Reservation, (reservation) => reservation.employee)
  reservation: Reservation;
}
