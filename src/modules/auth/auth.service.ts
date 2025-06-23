import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/common/helper/bcrypt.helper';
import { UsersService } from 'src/modules/users/users.service';
import { UserType } from 'src/common/interface/user.interface';
import { MailService } from 'src/mail/mail.service';
import { PasswordResetTokenService } from '../password_reset_token/password_reset_token.service';
import { ChangePassworDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly passwordResetTokenService: PasswordResetTokenService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const isValidPass = await comparePassword(password, user.password);
    if (!isValidPass) {
      throw new UnauthorizedException('Mật khẩu người dùng không đúng!');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }
  login(user: UserType) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async forgotPassword(email: string) {
    try {
      if (!email) {
        throw new BadRequestException('Vui lòng gửi email người dùng!');
      }
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('Email người dùng không hợp lệ!');
      }

      const token = await this.passwordResetTokenService.createToken(user);

      const sendEmail = await this.mailService.sendEmailForgotPassword(
        user,
        token.token,
      );
      console.log(sendEmail);
      if (sendEmail.status) {
        return {
          status: true,
          message: 'Gửi mã về email người dùng thành công!',
        };
      }
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi không thể gửi mã xác thực về email người dùng!',
      );
    }
  }

  async changePassword(dataResetPassword: ChangePassworDto) {
    try {
      const { email, password, token } = dataResetPassword;
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('Email người dùng không tồn tại!');
      }
      const isCheckToken = await this.passwordResetTokenService.checkToken(
        token,
        user,
      );
      if (isCheckToken.status) {
        await this.userService.changePassword(user, password);
        return {
          status: true,
          message: 'Thay đổi mật khẩu thành công!',
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}
