import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployessDto } from './dto/create-employees.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateEmployDto } from './dto/update-employees.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employessService: EmployeesService) {}

  @Post('/create-employee')
  @Public()
  @UseInterceptors(FileInterceptor('avatar'))
  createEmploy(
    @Body('user') userDto: CreateUserDto,
    @Body('employee') employeeDto: CreateEmployessDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.employessService.createEmployee(userDto, employeeDto, avatar);
  }
  // @Post('/create-employee')
  // @Public()
  // @UseInterceptors(FileInterceptor('avatar'))
  // createEmploy(
  //   @Body('user') user: string,
  //   @Body('employee') employee: string,
  //   @UploadedFile() avatar: Express.Multer.File,
  // ) {
  //   const userDto = JSON.parse(user);
  //   const employeeDto = JSON.parse(employee);

  //   return this.employessService.createEmployee(userDto, employeeDto, avatar);
  // }

  @Patch('/update-employee')
  @Public()
  updateEmployee(
    @Body() updateDataEmpploy: UpdateEmployDto,
    @Body() updateDataUser: UpdateUserDto,
    @UploadedFile() avatarUpdate: Express.Multer.File,
  ) {
    return this.employessService.updateEmployee(
      updateDataUser,
      updateDataEmpploy,
      avatarUpdate,
    );
  }

  @Delete('/delete-employee/:employeeId')
  @Public()
  deleteEmployee(@Param('employeeId') employeeId: string) {
    return this.employessService.deleteEmployee(Number(employeeId));
  }

  @Get('/get-employees')
  @Public()
  getEmployees() {
    return this.employessService.getEmployees();
  }
}
