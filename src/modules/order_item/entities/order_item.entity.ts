import { Combo } from 'src/modules/combos/entities/combo.entity';
import { Dish } from 'src/modules/dishs/entities/dish.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderItemStatus {
  PENDING = 'pending', // Chờ xác nhận
  PREPARING = 'preparing', // Đang chế biến
  COMPLETED = 'completed', // Đã hoàn thành
  CANCELLED = 'cancelled', // Đã hủy
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quanity: number;

  @Column()
  total_price: number;

  @Column({
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.PENDING,
  })
  status: OrderItemStatus;

  @ManyToOne(() => Order, (order) => order.orderitem)
  order: Order;

  @ManyToOne(() => Combo, (combo) => combo.orderitem)
  combo: Combo;

  @ManyToOne(() => Dish, (dish) => dish.orderitem)
  dish: Dish;
}
