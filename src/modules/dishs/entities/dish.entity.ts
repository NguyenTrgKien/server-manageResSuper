import { Category } from 'src/modules/category/entities/category.entity';
import { ComboItem } from 'src/modules/combo_item/entities/combo_item.entity';
import { OrderItem } from 'src/modules/order_item/entities/order_item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  dish_code: string;

  @Column()
  name: string;

  @Column()
  desciption: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost_price: number;

  @Column()
  image: string;

  @Column({ type: 'int' })
  proccessing_time: number;

  @OneToMany(() => ComboItem, (comboitem) => comboitem.dish)
  comboitem: ComboItem;

  @OneToMany(() => OrderItem, (orderitem) => orderitem.dish)
  orderitem: OrderItem;

  @OneToMany(() => Category, (category) => category.dish)
  category: Category;
}
