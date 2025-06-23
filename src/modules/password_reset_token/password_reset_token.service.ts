import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password_reset_token.entity';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { comparePassword, hashPassword } from 'src/common/helper/bcrypt.helper';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PasswordResetTokenService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRes: Repository<PasswordResetToken>,
  ) {}

  async createToken(user: User) {
    const token = nanoid(8);
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // Hết hạn sau 5 phút
    const tokenEntity = this.passwordResetTokenRes.create({
      token: await hashPassword(token),
      user: { id: user.id },
      expiresAt,
    });
    await this.passwordResetTokenRes.save(tokenEntity);
    return {
      status: true,
      message: 'Lưu token thành công!',
      token: token,
    };
  }

  async checkToken(token: string, user: User) {
    try {
      const findToken = await this.passwordResetTokenRes.findOne({
        where: {
          user: { id: user.id },
        },
      });
      if (!findToken) {
        throw new BadRequestException('Không tìm thấy mã đặt lại mật khẩu!');
      }
      const isValid = await comparePassword(token, findToken.token);
      if (!isValid) {
        throw new BadRequestException('Mã xác nhận không đúng!');
      }
      return {
        status: true,
        message: 'Token hợp lệ',
      };
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi token không hợp lệ!');
    }
  }
}
