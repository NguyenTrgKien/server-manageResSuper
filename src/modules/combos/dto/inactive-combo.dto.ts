import { PartialType } from '@nestjs/mapped-types';
import { CreateComboDto } from './create-combo.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class InActiveComboDto extends PartialType(CreateComboDto) {
  @IsInt()
  @IsNotEmpty({ message: 'Id combo không được để trống!' })
  id: number;
}
