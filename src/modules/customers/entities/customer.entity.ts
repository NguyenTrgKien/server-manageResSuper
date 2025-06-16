import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  customer_code: string;

  @Column()
  fullName: string;

  @Column()
  customer_type: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ type: 'date' })
  birth_day: Date;

  @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Column()
  avatar: string;

  @OneToOne(() => User, (user) => user.customer)
  @JoinColumn()
  user: User;
}
