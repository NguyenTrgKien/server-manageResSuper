import { PartialType } from '@nestjs/mapped-types';
import { CreateDishimageDto } from './create-dishimage.dto';

export class UpdateDishimageDto extends PartialType(CreateDishimageDto) {}
