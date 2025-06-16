import { PartialType } from '@nestjs/mapped-types';
import { CreateComboItemDto } from './create-combo_item.dto';

export class UpdateComboItemDto extends PartialType(CreateComboItemDto) {}
