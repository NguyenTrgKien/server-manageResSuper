import { Employess } from 'src/modules/employess/entities/employess.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  amount: number;

  @Column()
  received_amount: string;

  @Column()
  change_amount: string;

  @Column()
  note: string;

  @ManyToOne(() => Order, (order) => order.payment)
  order: Order;

  @ManyToOne(() => Employess, (employes) => employes.payment)
  employes: Employess;
}
