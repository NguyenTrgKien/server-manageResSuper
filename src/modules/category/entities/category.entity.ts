import { Dish } from 'src/modules/dishs/entities/dish.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  desciprtion: string;

  @Column()
  isActive: boolean;

  @OneToMany(() => Dish, (dish) => dish.category)
  dish: Dish;
}
