import { Test, TestingModule } from '@nestjs/testing';
import { EmployessService } from './employess.service';

describe('EmployessService', () => {
  let service: EmployessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployessService],
    }).compile();

    service = module.get<EmployessService>(EmployessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
