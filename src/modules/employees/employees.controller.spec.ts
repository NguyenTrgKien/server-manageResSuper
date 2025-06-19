import { Test, TestingModule } from '@nestjs/testing';
import { EmployessController } from './employees.controller';
import { EmployessService } from './employees.service';

describe('EmployessController', () => {
  let controller: EmployessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployessController],
      providers: [EmployessService],
    }).compile();

    controller = module.get<EmployessController>(EmployessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
