import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployessDto } from './create-employess.dto';

export class UpdateEmployessDto extends PartialType(CreateEmployessDto) {}
