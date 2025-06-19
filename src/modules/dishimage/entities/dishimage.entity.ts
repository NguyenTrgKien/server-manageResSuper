import { Dish } from 'src/modules/dishs/entities/dish.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dishimage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image_url: string;

  @Column()
  publicId: string; // Lưu publicId của cloudinary để có thể xóa

  @ManyToOne(() => Dish, (dish) => dish.images)
  dish: Dish;
}
