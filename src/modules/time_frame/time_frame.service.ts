import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTimeFrameDto } from './dto/create-time_frame.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeFrame } from './entities/time_frame.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TimeFrameService {
  constructor(
    @InjectRepository(TimeFrame)
    private readonly timeframeRepository: Repository<TimeFrame>,
  ) {}
  async createTimeframe(dataCreateTimeframe: CreateTimeFrameDto) {
    try {
      const { start_time, end_time } = dataCreateTimeframe;
      const existTimeframe = await this.timeframeRepository.findOne({
        where: {
          start_time: start_time,
          end_time: end_time,
        },
      });
      if (existTimeframe) {
        throw new BadRequestException('Khưng giờ này đã tồn tại!');
      }
      const newTimeframe = this.timeframeRepository.create({
        ...dataCreateTimeframe,
        is_Active: true,
      });
      await this.timeframeRepository.save(newTimeframe);
      return {
        status: true,
        message: 'Tạo khung giờ thành công!',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Lỗi không thể tạo khung giờ!');
    }
  }

  async findTimeframeById(id: number) {
    const timeframe = await this.timeframeRepository.findOne({
      where: {
        id,
      },
    });
    return timeframe;
  }
}
