import { ComboItem } from 'src/modules/combo_item/entities/combo_item.entity';
import { OrderItem } from 'src/modules/order_item/entities/order_item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Combo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  combo_code: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  combo_price: number;

  @Column()
  image: string;

  @Column({ default: false })
  is_featured: boolean; // Combo nổi bật

  @Column({ type: 'int' })
  proccessing_time: number; // Thởi gian chế biến

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  origin_price: number; // Giá gốc nếu có khuyến mãi

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderitem) => orderitem.combo)
  orderitem: OrderItem;

  @OneToMany(() => ComboItem, (comboitem) => comboitem.combo)
  comboitem: ComboItem;
}
