import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetTokenController } from './password_reset_token.controller';
import { PasswordResetTokenService } from './password_reset_token.service';

describe('PasswordResetTokenController', () => {
  let controller: PasswordResetTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordResetTokenController],
      providers: [PasswordResetTokenService],
    }).compile();

    controller = module.get<PasswordResetTokenController>(PasswordResetTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
