import { Employess } from 'src/modules/employees/entities/employees.entity';
import { OrderItem } from 'src/modules/order_item/entities/order_item.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { Reservation } from 'src/modules/reservation/entities/reservation.entity';
import { Table } from 'src/modules/tables/entities/table.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderType {
  DINE_IN = 'dine_in',
  TAKEAWAY = 'takeaway',
}

export enum OrderStatus {
  PENDING = 'pending', // Đơn mới tạo, chưa xác nhận
  CONFIRMED = 'confirmed', // Đã xác nhận đơn hàng
  PREPARING = 'preparing', // Đang chuẩn bị
  READY = 'ready', // Đã sẵn sàng
  COMPLETED = 'completed', // Đã hoàn thành(phục vụ xong)
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  UNPAID = 'unpaid', // Chưa thanh toán
  PAID = 'confirmed', // Đã thanh toán đầy đủ
}

export enum PaymentMethod {
  CASH = 'cash',
  MOMO = 'momo',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  order_code: string;

  @Column({ type: 'enum', enum: OrderType, default: OrderType.DINE_IN })
  order_type: OrderType;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  order_status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  customer_name: string;

  @Column({ nullable: true })
  customer_phone: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  payment_status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH })
  payment_method: PaymentMethod;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.order, { nullable: true })
  user: User;

  @ManyToOne(() => Employess, (employes) => employes.order, { nullable: true })
  employes: Employess;

  @ManyToOne(() => Table, (table) => table.order, { nullable: true })
  table: Table;

  @ManyToOne(() => Payment, (payment) => payment.order, { nullable: true })
  payment: Payment[];

  @OneToMany(() => OrderItem, (orderitem) => orderitem.order)
  orderitem: OrderItem[];

  @OneToOne(() => Reservation, (reservation) => reservation.orders, {
    nullable: true,
  })
  reservation: Reservation;
}
