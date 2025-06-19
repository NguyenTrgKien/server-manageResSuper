import { Test, TestingModule } from '@nestjs/testing';
import { DishimageController } from './dishimage.controller';
import { DishimageService } from './dishimage.service';

describe('DishimageController', () => {
  let controller: DishimageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DishimageController],
      providers: [DishimageService],
    }).compile();

    controller = module.get<DishimageController>(DishimageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
