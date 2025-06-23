import { Test, TestingModule } from '@nestjs/testing';
import { TimeFrameController } from './time_frame.controller';
import { TimeFrameService } from './time_frame.service';

describe('TimeFrameController', () => {
  let controller: TimeFrameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeFrameController],
      providers: [TimeFrameService],
    }).compile();

    controller = module.get<TimeFrameController>(TimeFrameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
