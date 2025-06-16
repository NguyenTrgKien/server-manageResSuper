import { Area } from 'src/modules/areas/entities/area.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Reservation } from 'src/modules/reservation/entities/reservation.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TableType {
  STANDARD = 'standard', // Bàn thường
  VIP = 'vip', // bàn Vip
  OUTDOOR = 'outdoor', // bàn ngoài trời
  SMALL = 'small', // bàn nhỏ hai người
  FAMILY = 'family', // Bàn cho gia đình
  PRIVATE = 'private', // Bàn riêng tư
}

export enum TableStatus {
  AVAILABLE = 'available', // Còn trống
  OCCUPIED = 'occupied', // Đang có khách
  RESERVED = 'reserved', // Đã đặt trước
  UNAVAILABLE = 'unvailable', // Không sử dụng được
}

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  table_code: string;

  @Column()
  capacity: number; // Số lượng khách hàng

  @Column({ type: 'enum', enum: TableType, default: TableType.STANDARD })
  table_type: TableType;

  @Column({ type: 'enum', enum: TableStatus, default: TableStatus.AVAILABLE })
  table_status: TableStatus;

  @Column()
  note: string;

  @OneToMany(() => Order, (order) => order.table)
  order: Order;

  @ManyToOne(() => Area, (area) => area.table)
  area: Area;

  @OneToMany(() => Reservation, (reservation) => reservation.table)
  reservation: Reservation;
}
