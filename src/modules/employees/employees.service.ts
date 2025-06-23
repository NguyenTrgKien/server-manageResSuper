import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateEmployessDto } from './dto/create-employees.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employess, EmployesStatus } from './entities/employees.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateEmployDto } from './dto/update-employees.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employess)
    private readonly employesRepository: Repository<Employess>,
    private readonly userService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
    private dataSource: DataSource,
  ) {}
  async createEmployee(
    userDto: CreateUserDto,
    employeeDto: CreateEmployessDto,
    avatar: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // Kêt nối đến database
    await queryRunner.startTransaction(); // Bắt đầu transaction mới
    try {
      // Tạo người dùng
      const user = await this.userService.register(
        userDto,
        queryRunner.manager,
      );
      if (user.status) {
        const avatar_url =
          await this.cloudinaryService.uploadSingleFile(avatar);
        const totalEmploy = await this.employesRepository.count();
        const nextEmploy = `NV_${totalEmploy.toString().padStart(3, '0')}`;
        const newEmploy = queryRunner.manager.create(Employess, {
          // Thêm  transaction để nó có thể biết được đoạn này năm trong cùng an toàn
          ...employeeDto,
          employes_code: nextEmploy,
          avatar: avatar_url.url,
          publicId: avatar_url.publicId,
          status: employeeDto.status
            ? employeeDto.status
            : EmployesStatus.ACTIVE,
          user: { id: user.id },
        });
        await queryRunner.manager.save(Employess, newEmploy);
        await queryRunner.commitTransaction(); // Thực hiện thay đổi khi thành công và không có lỗi xảy ra
        return {
          status: true,
          message: 'Tạo nhân viên thành công!',
        };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction(); // HỦy bỏ các thay đổi khi có lôi xảy ra
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          error.message || 'Không thể tạo nhân viên!',
        );
      }
    } finally {
      await queryRunner.release(); // Giải phóng tài nguyên kết nối
    }
  }

  async updateEmployee(
    updateDataUser: UpdateUserDto,
    updateDataEmpploy: UpdateEmployDto,
    avatarUpdate: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const employee = await this.employesRepository.findOne({
        where: {
          id: updateDataEmpploy.id,
        },
        relations: ['user'],
      });
      if (!employee) {
        throw new BadRequestException('Nhân viên không tồn tại!');
      }
      if (!employee.user) {
        throw new BadRequestException(
          'Tài khoản người dùng của nhân viên không tồn tại!',
        );
      }
      await this.userService.updateUser(updateDataUser, queryRunner.manager);
      const updateEmployeeData: Partial<Employess> = {
        // Nó sẽ biến Employess thành các thuộc tính tủy chọn có thể thêm các thuộc tinhd khác vào
        ...updateDataEmpploy,
      };
      if (avatarUpdate) {
        if (employee.publicId) {
          await this.cloudinaryService.deleteFile(employee.publicId);
        }
        const uploadResult =
          await this.cloudinaryService.uploadSingleFile(avatarUpdate);
        updateEmployeeData.avatar = uploadResult.url;
        updateEmployeeData.publicId = uploadResult.publicId;
      }
      await queryRunner.manager.update(
        Employess,
        employee.id,
        updateEmployeeData,
      );
      await queryRunner.commitTransaction(); // Lưu thay đổi khi không có lỗi
      return {
        status: true,
        message: 'Cập nhật người dùng thành công!',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction(); // HỦy bỏ thay đổi khi có lỗi xảy ra
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi không thể cập nhật người dùng!',
      );
    } finally {
      await queryRunner.release(); // Luôn giải phóng dù thành công hay thất bại
    }
  }

  async deleteEmployee(employeeId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const employee = await this.employesRepository.findOne({
        where: {
          id: employeeId,
        },
        relations: ['user'],
      });
      if (!employee) {
        throw new BadRequestException('Nhân viên không tồn tại!');
      }
      if (!employee.user.id) {
        throw new BadRequestException(
          'Không tìm thấy tài khoản người dùng của nhân viên!',
        );
      }
      await this.userService.updateUser(
        {
          id: employee.user.id,
          isActive: false,
        },
        queryRunner.manager,
      );

      await queryRunner.manager.delete(Employess, employeeId);
      await this.cloudinaryService.deleteFile(employee.publicId);
      await queryRunner.commitTransaction();
      return {
        status: true,
        message: 'Xóa nhân viên thành công!',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Đã có lỗi xãy ra khi xóa nhân viên!',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getEmployees() {
    const listEmployees = await this.employesRepository.find();
    return {
      status: true,
      message: 'Lấy danh sách nhân viên thành công!',
      employees: listEmployees,
    };
  }
}
