import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employess } from './entities/employees.entity';
import { UsersModule } from '../users/users.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employess]), UsersModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, CloudinaryService],
})
export class EmployessModule {}
