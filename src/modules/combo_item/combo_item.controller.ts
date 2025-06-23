import { Controller } from '@nestjs/common';
import { ComboItemService } from './combo_item.service';

@Controller('combo-item')
export class ComboItemController {
  constructor(private readonly comboItemService: ComboItemService) {}
}
