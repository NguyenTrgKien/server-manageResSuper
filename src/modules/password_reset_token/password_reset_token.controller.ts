import { Controller } from '@nestjs/common';
import { PasswordResetTokenService } from './password_reset_token.service';

@Controller('password-reset-token')
export class PasswordResetTokenController {
  constructor(
    private readonly passwordResetTokenService: PasswordResetTokenService,
  ) {}
}
