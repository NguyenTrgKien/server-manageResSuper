import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Ở class này khi được gọi nó sẽ gọi local.strategy.ts để thực hiện xác thực người dùng
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: { message?: string } | string | undefined,
  ): TUser {
    if (err) {
      throw err;
    }
    if (!user) {
      const errMessage =
        typeof info === 'object' && info?.message
          ? info.message
          : 'Thông tin đăng nhập không hợp lệ!';
      if (errMessage === 'Missing credentials') {
        throw new BadRequestException('Vui lòng nhập email và password!');
      }
      throw new UnauthorizedException(errMessage);
    }
    return user as TUser;
  }
}
