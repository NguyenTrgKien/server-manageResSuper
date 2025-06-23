import { Module } from '@nestjs/common';
import { CombosService } from './combos.service';
import { CombosController } from './combos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Combo } from './entities/combo.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DishsModule } from '../dishs/dishs.module';
import { ComboItemModule } from '../combo_item/combo_item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Combo]), DishsModule, ComboItemModule],
  controllers: [CombosController],
  providers: [CombosService, CloudinaryService],
})
export class CombosModule {}
