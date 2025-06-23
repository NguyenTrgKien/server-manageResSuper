import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeFrameDto } from './create-time_frame.dto';

export class UpdateTimeFrameDto extends PartialType(CreateTimeFrameDto) {}
