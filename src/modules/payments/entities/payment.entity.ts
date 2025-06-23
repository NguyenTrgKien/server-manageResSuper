import { Employess } from 'src/modules/employees/entities/employees.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PaymentMethod {
  CASH = 'cash',
  MOMO = 'momo',
}

export enum PaymentStatus {
  UNPAID = 'unpaid', // Chưa thanh toán
  PAID = 'paid', // Đã thanh toán
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  payment_code: string;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH })
  payment_method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  payment_status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  received_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  change_amount: number;

  @Column({ nullable: true })
  note: string;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn()
  order: Order; // Một thanh toán có thể thanh toán cho nhiều đơn hàng

  @ManyToOne(() => User, (user) => user.payment)
  user: User;

  @ManyToOne(() => Employess, (employes) => employes.payment)
  employes: Employess;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paid_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
