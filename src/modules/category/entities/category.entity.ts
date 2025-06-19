import { Dish } from 'src/modules/dishs/entities/dish.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ unique: true })
  code: string;

  @OneToMany(() => Dish, (dish) => dish.category)
  dish: Dish[];
}
