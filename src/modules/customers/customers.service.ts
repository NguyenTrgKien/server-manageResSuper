import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer, Customer_Type } from './entities/customer.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly userService: UsersService,
    private dataSrource: DataSource,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async createCustomer(
    createCustomerDto: CreateCustomerDto,
    createUserDto: CreateUserDto,
  ) {
    const queryRunner = this.dataSrource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const avatarDefault = `https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg`;
      const user = await this.userService.register(
        createUserDto,
        queryRunner.manager,
      );
      const totalCustomer = await this.customerRepository.count();
      const nextCustomer = `KH_${(totalCustomer + 1).toString().padStart(8, '0')}`;
      const newCustomer = queryRunner.manager.create(Customer, {
        ...createCustomerDto,
        customer_code: nextCustomer,
        customer_type: Customer_Type.NORMAL,
        avatar: avatarDefault,
        user: { id: user.id },
      });
      await queryRunner.manager.save(Customer, newCustomer);
      await queryRunner.commitTransaction();
      return {
        status: true,
        message: 'Tạo khách hàng thành công!',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi không thể tạo người dùng!');
    } finally {
      await queryRunner.release();
    }
  }

  async updateCustomer(
    dataUpdateUser: UpdateUserDto,
    dataUpdateCustomer: UpdateCustomerDto,
    avatarUrl: Express.Multer.File,
  ) {
    const queryRunner = this.dataSrource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const customer = await this.customerRepository.findOne({
        where: {
          id: dataUpdateCustomer.id,
        },
        relations: ['user'],
      });
      if (!customer) {
        throw new BadRequestException(
          'Người dùng này không có thông tin khách hàng!',
        );
      }
      if (!customer.user) {
        throw new BadRequestException('Tài khoản khách hàng không tồn tại!');
      }
      await this.userService.updateUser(dataUpdateUser, queryRunner.manager);
      const isUpdate =
        Object.keys(dataUpdateCustomer).length > 0 &&
        Object.values(dataUpdateCustomer).some(
          (value) => value !== undefined && value !== null,
        );
      const hasAvatar = !!avatarUrl;
      if (!isUpdate && !hasAvatar) {
        await queryRunner.commitTransaction();
        return {
          status: true,
          message: 'Cập nhật thông tin khách hàng thành công!',
        };
      }
      const dataUpdate: Partial<Customer> = {
        ...dataUpdateCustomer,
      };
      if (avatarUrl) {
        const uploadResult =
          await this.cloudinaryService.uploadSingleFile(avatarUrl);
        dataUpdate.avatar = uploadResult.url;
        dataUpdate.publicId = uploadResult.publicId;
        if (customer.publicId) {
          await this.cloudinaryService.deleteFile(customer.publicId);
        }
      }
      await queryRunner.manager.update(Customer, customer.id, {
        ...dataUpdate,
      });
      await queryRunner.commitTransaction();
      return {
        status: true,
        message: 'Cập nhật thông tin khách hàng thành công!',
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã xảy ra lỗi không thể cập nhật thông tin khách hàng!',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCustomer(customerId: number) {
    const queryRunner = this.dataSrource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const customer = await this.customerRepository.findOne({
        where: {
          id: customerId,
        },
        relations: ['user'],
      });
      console.log(customer);
      if (!customer) {
        throw new BadRequestException('Tài khoản khách hàng không tồn tại!');
      }
      if (!customer.user) {
        throw new BadRequestException(
          'Không tìm thấy tài khoản khách hàng này!',
        );
      }
      await queryRunner.manager.delete(Customer, customer.id);
      await this.userService.updateUser(
        {
          id: customer.user.id,
          isActive: false,
        },
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return {
        status: true,
        message: 'Xóa người dùng thành công!',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã xảy ra lỗi, không thể xóa người dùng!',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
