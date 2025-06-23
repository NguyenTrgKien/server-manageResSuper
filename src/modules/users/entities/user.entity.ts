import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Employess } from 'src/modules/employees/entities/employees.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { PasswordResetToken } from 'src/modules/password_reset_token/entities/password_reset_token.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { Reservation } from 'src/modules/reservation/entities/reservation.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RoleUser {
  ADMIN = 'admin',
  USER = 'user',
  STAFF = 'staff',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn() // Khóa chính này sẽ tự động tăng
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: false })
  isActive: boolean;

  @Column({ type: 'enum', enum: RoleUser, default: RoleUser.USER })
  role: RoleUser;

  @OneToOne(() => Customer, (customer) => customer.user)
  customer: Customer;

  @OneToOne(() => Employess, (employes) => employes.user)
  employes: Employess;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation[];

  @OneToMany(() => Order, (order) => order.user)
  order: Order[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payment: Payment[];

  @OneToMany(
    () => PasswordResetToken,
    (passwordResetToken) => passwordResetToken.user,
  )
  passwordResetToken: PasswordResetToken;
}
