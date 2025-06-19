import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployessDto } from './dto/create-employees.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employessService: EmployeesService) {}

  @Post('/create-employ')
  @Public()
  @UseInterceptors(FileInterceptor('avatar'))
  createEmploy(
    @Body('user') userDto: CreateUserDto,
    @Body('employee') employeeDto: CreateEmployessDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.employessService.createEmployee(userDto, employeeDto, avatar);
  }
}
