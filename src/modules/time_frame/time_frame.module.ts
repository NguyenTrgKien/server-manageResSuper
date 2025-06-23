import { Module } from '@nestjs/common';
import { TimeFrameService } from './time_frame.service';
import { TimeFrameController } from './time_frame.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeFrame } from './entities/time_frame.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeFrame])],
  controllers: [TimeFrameController],
  providers: [TimeFrameService],
  exports: [TimeFrameService],
})
export class TimeFrameModule {}
