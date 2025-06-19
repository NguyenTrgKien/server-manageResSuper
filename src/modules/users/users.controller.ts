import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  register(@Body() data: CreateUserDto) {
    return this.usersService.register(data);
  }
  @Delete('/delete-user/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.usersService.deleteUser(Number(userId));
  }
}
