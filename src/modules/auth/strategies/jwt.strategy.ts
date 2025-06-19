import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface PayloadType {
  sub: number;
  email: string;
  role: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header
      ignoreExpiration: false, // false thì sẽ kiểm tra thời hạn token, true thì không kiểm tra
      secretOrKey: configService.get<string>('JWT_SECRET') || '', // lấy mã bí mật để có thể giải mã token
    });
  }

  validate(payload: PayloadType) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
