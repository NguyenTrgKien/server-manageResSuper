import {
  Controller,
  Post,
  Body,
  Patch,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('/create-customer')
  @Public()
  createCustomer(
    @Body('customer') createCustomerDto: CreateCustomerDto,
    @Body('user') createUserDto: CreateUserDto,
  ) {
    return this.customersService.createCustomer(
      createCustomerDto,
      createUserDto,
    );
  }

  @Patch('/update-customer')
  @Public()
  @UseInterceptors(FileInterceptor('avatar'))
  updateCustomer(
    @Body('user') dataUpdateUser: UpdateUserDto,
    @Body('customer') dataUpdateCustomer: UpdateCustomerDto,
    @UploadedFile() avatarUrl: Express.Multer.File,
  ) {
    return this.customersService.updateCustomer(
      dataUpdateUser,
      dataUpdateCustomer,
      avatarUrl,
    );
  }

  @Delete('/delete-customer/:customerId')
  @Public()
  deleteCustomer(@Param('customerId') customerId: string) {
    return this.customersService.deleteCustomer(Number(customerId));
  }
}
