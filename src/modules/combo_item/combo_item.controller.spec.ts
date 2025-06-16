import { Test, TestingModule } from '@nestjs/testing';
import { ComboItemController } from './combo_item.controller';
import { ComboItemService } from './combo_item.service';

describe('ComboItemController', () => {
  let controller: ComboItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComboItemController],
      providers: [ComboItemService],
    }).compile();

    controller = module.get<ComboItemController>(ComboItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
