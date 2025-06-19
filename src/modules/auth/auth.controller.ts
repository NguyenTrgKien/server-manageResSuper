import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/common/decorator/public.decorator';
import { UserRequest } from 'src/common/interface/user-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  login(@Request() req: UserRequest) {
    return this.authService.login(req.user);
  }

  @Get('/get-profile')
  // @Public()
  getProfile(@Request() req: UserRequest) {
    const { id, role, email } = req.user;
    console.log(req.user);
    return {
      user: {
        id,
        email,
        role,
      },
    };
  }
}
