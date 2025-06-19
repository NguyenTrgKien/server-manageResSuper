import { Test, TestingModule } from '@nestjs/testing';
import { DishimageService } from './dishimage.service';

describe('DishimageService', () => {
  let service: DishimageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DishimageService],
    }).compile();

    service = module.get<DishimageService>(DishimageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
