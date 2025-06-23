import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Customer_Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Customer_Type {
  VIP = 'vip',
  NORMAL = 'normal',
  GUEST = 'guest',
  MEMBER = 'member',
}

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  customer_code: string;

  @Column({ type: 'enum', enum: Customer_Type, default: Customer_Type.NORMAL })
  customer_type: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  birth_day: string;

  @Column({
    type: 'enum',
    enum: Customer_Gender,
    default: Customer_Gender.OTHER,
  })
  gender: Customer_Gender;

  @Column({ nullable: true })
  publicId: string;

  @Column()
  avatar: string;

  @OneToOne(() => User, (user) => user.customer, { nullable: true })
  @JoinColumn()
  user: User;
}
