import { Module } from '@nestjs/common';
import { PasswordResetTokenService } from './password_reset_token.service';
import { PasswordResetTokenController } from './password_reset_token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password_reset_token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetToken])],
  controllers: [PasswordResetTokenController],
  providers: [PasswordResetTokenService],
  exports: [PasswordResetTokenService],
})
export class PasswordResetTokenModule {}
