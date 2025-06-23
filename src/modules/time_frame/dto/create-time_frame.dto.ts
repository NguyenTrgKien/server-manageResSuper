import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTimeFrameDto {
  @IsString()
  @IsNotEmpty({ message: 'Thười gian bắt đầu không được thiếu!' })
  start_time: string;

  @IsString()
  @IsNotEmpty({ message: 'Thời gian kết thúc không được thiếu!' })
  end_time: string;
}
