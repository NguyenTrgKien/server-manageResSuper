import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/common/decorator/public.decorator';
import { UserRequest } from 'src/common/interface/user-request.interface';
import { ChangePassworDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  login(@Request() req: UserRequest) {
    return this.authService.login(req.user);
  }

  @Post('/forgot-password')
  @Public()
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('/reset-password')
  @Public()
  changePassword(@Body() dataResetPassword: ChangePassworDto) {
    return this.authService.changePassword(dataResetPassword);
  }
}
