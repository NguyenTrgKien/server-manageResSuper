import { Module } from '@nestjs/common';
import { ComboItemService } from './combo_item.service';
import { ComboItemController } from './combo_item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboItem } from './entities/combo_item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComboItem])],
  controllers: [ComboItemController],
  providers: [ComboItemService],
  exports: [ComboItemService],
})
export class ComboItemModule {}
