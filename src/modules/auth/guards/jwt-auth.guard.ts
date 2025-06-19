import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';

export interface JwtUser {
  id: number;
  email: string;
}

@Injectable()
// Khi được gọi nó sẽ gọi đến file jwtStrategy để thực hiện xác thực
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Cấu hình để sử dụng @Public() trong các route muốn bỏ qua xác thực jwt
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: JwtUser,
    info: { message?: string } | string | undefined,
  ): TUser {
    if (err) {
      throw new UnauthorizedException('Xác thực không thành công');
    }
    if (!user) {
      const errMessage =
        typeof info === 'object'
          ? info.message
          : 'Lỗi token không hợp lệ, hoặc token đã hết hạn!';
      if (errMessage === 'No auth token') {
        throw new BadRequestException(errMessage);
      } else if (errMessage === 'jwt malformed') {
        throw new BadRequestException('Token không đúng định dạng');
      }
      throw new UnauthorizedException(errMessage);
    }
    return user as TUser;
  }
}
