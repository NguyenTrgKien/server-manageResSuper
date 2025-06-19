import { Module } from '@nestjs/common';
import { DishimageService } from './dishimage.service';
import { DishimageController } from './dishimage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dishimage } from './entities/dishimage.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dishimage]), CloudinaryModule],
  controllers: [DishimageController],
  providers: [DishimageService],
  exports: [DishimageService],
})
export class DishimageModule {}
