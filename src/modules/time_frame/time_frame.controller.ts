import { Controller, Post, Body } from '@nestjs/common';
import { TimeFrameService } from './time_frame.service';
import { CreateTimeFrameDto } from './dto/create-time_frame.dto';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('time-frame')
export class TimeFrameController {
  constructor(private readonly timeFrameService: TimeFrameService) {}
  @Post('/create-timeframe')
  @Public()
  createTimeframe(@Body() dataCreateTimeframe: CreateTimeFrameDto) {
    return this.timeFrameService.createTimeframe(dataCreateTimeframe);
  }
}
