import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @Public()
  register(@Body() data: CreateUserDto) {
    return this.usersService.register(data);
  }
  @Delete('/delete-user/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.usersService.deleteUser(Number(userId));
  }

  @Patch('/update-user')
  @Public()
  updateUser(@Body() updateUser: UpdateUserDto) {
    return this.usersService.updateUser(updateUser);
  }
}
