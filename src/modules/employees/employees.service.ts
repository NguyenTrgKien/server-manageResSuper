import { Injectable } from '@nestjs/common';
import { CreateEmployessDto } from './dto/create-employees.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employess, EmployesStatus } from './entities/employees.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employess)
    private readonly employesRepository: Repository<Employess>,
    private readonly userService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async createEmployee(
    userDto: CreateUserDto,
    employeeDto: CreateEmployessDto,
    avatar: Express.Multer.File,
  ) {
    try {
      const user = await this.userService.register(userDto);
      if (user.status) {
        const avatar_url =
          await this.cloudinaryService.uploadSingleFile(avatar);
        const totalEmploy = await this.employesRepository.count();
        const nextEmploy = `NV_${totalEmploy.toString().padStart(3, '0')}`;
        const newEmploy = this.employesRepository.create({
          ...employeeDto,
          employes_code: nextEmploy,
          avatar: avatar_url.url,
          status: employeeDto.status
            ? employeeDto.status
            : EmployesStatus.ACTIVE,
          user: { id: user.id },
        });
        await this.employesRepository.save(newEmploy);
        return {
          status: true,
          message: 'Tạo nhân viên thành công!',
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Không thể tạo nhân viên!');
      }
    }
  }
}
