import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Employess } from 'src/modules/employess/entities/employess.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Reservation } from 'src/modules/reservation/entities/reservation.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToOne(() => Role, (role) => role.user)
  @JoinColumn()
  role: Role;

  @OneToOne(() => Customer, (customer) => customer.user)
  customer: Customer;

  @OneToOne(() => Employess, (employes) => employes.user)
  employes: Employess;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation;

  @OneToMany(() => Order, (order) => order.user)
  order: Order;
}
