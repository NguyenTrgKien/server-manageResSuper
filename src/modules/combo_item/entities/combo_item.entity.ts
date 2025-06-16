import { Combo } from 'src/modules/combos/entities/combo.entity';
import { Dish } from 'src/modules/dishs/entities/dish.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ComboItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  note: string;

  @ManyToOne(() => Combo, (combo) => combo.comboitem)
  combo: Combo;

  @ManyToOne(() => Dish, (dish) => dish.comboitem)
  dish: Dish;
}
