import { Module } from '@nestjs/common';
import { ComboItemService } from './combo_item.service';
import { ComboItemController } from './combo_item.controller';

@Module({
  controllers: [ComboItemController],
  providers: [ComboItemService],
})
export class ComboItemModule {}
