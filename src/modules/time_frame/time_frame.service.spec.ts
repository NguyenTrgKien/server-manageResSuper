import { Test, TestingModule } from '@nestjs/testing';
import { TimeFrameService } from './time_frame.service';

describe('TimeFrameService', () => {
  let service: TimeFrameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeFrameService],
    }).compile();

    service = module.get<TimeFrameService>(TimeFrameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
