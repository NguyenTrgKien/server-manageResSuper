import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserType } from 'src/common/interface/user.interface';

@Injectable()
// Class dùng để xác thực người dùng
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // Mặc định passport-local nó sẽ lấy trường username và password mặc định
      usernameField: 'email', // Cấu hình để nó đổi mặc định từ username thành email
    });
  }

  async validate(email: string, password: string): Promise<UserType> {
    const user = await this.authService.validateUser(email, password);
    return user;
  }
}
