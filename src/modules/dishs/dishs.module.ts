import { Module } from '@nestjs/common';
import { DishsService } from './dishs.service';
import { DishsController } from './dishs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Category } from '../category/entities/category.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { DishimageModule } from '../dishimage/dishimage.module';
import { CategoryModule } from '../category/category.module';

@Module({
  controllers: [DishsController],
  providers: [DishsService],
  imports: [
    TypeOrmModule.forFeature([Dish, Category]),
    CloudinaryModule,
    DishimageModule,
    CategoryModule,
  ],
  exports: [DishsService],
})
export class DishsModule {}
