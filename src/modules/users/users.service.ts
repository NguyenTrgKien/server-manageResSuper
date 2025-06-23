import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleUser, User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/helper/bcrypt.helper';
import { PasswordResetTokenService } from '../password_reset_token/password_reset_token.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // Inject entity user
    private readonly userRepository: Repository<User>, // Dùng để thao tác với cơ sở dữ liệu
    private readonly passwordResetToken: PasswordResetTokenService,
  ) {}
  async register(data: CreateUserDto, manager?: EntityManager) {
    const { email, password, username, role } = data;
    const isCheckEmail = await this.findByEmail(email);
    if (isCheckEmail) {
      throw new BadRequestException(
        'Email đã tồn tại. Vui lòng chọn email khác!',
      );
    }
    const hashPas = await hashPassword(password);
    const dataUser = {
      email: email,
      password: hashPas,
      username: username,
      isActive: true,
      role: role ?? RoleUser.USER, // Dùng để gán mặc định khi bên trái là null hoặc undefined
    };
    if (manager) {
      const newUser = manager.create(User, dataUser);
      const user = await manager.save(User, newUser);
      return {
        status: true,
        message: 'Tạo người dùng thành công!',
        id: user.id,
      };
    }
    const newUser = this.userRepository.create(dataUser);
    const user = await this.userRepository.save(newUser);
    return {
      status: true,
      message: 'Tạo người dùng thành công!',
      id: user.id,
    };
  }
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      return null;
    }
    return user;
  }
  async findUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['employes', 'customer'],
    });
    return user;
  }
  async deleteUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng!');
    }
    await this.userRepository.delete(user.id);
    return {
      status: true,
      message: 'Xóa người dùng thành công!',
    };
  }
  async updateUser(data: Partial<User>, manager?: EntityManager) {
    if (!data.id) {
      throw new BadRequestException('Thiếu id người dùng để cập nhật!');
    }
    const { id, ...updateOptions } = data;
    const hasValidUpdate =
      Object.keys(updateOptions).length > 0 &&
      Object.values(updateOptions).some(
        (value) => value !== undefined && value !== null,
      );
    if (!hasValidUpdate) {
      throw new BadRequestException('Không có dữ liệu để cập nhật!');
    }
    if (manager) {
      await manager.update(User, id, updateOptions);
    } else {
      await this.userRepository.update(id, updateOptions);
    }
    return {
      status: true,
      message: 'Cập nhật người dùng thành công!',
    };
  }
  async changePassword(user: User, newPassword: string) {
    const hashPass = await hashPassword(newPassword);
    user.password = hashPass;
    await this.userRepository.save(user); // đảm bảo user đã có id
    return {
      status: true,
      message: 'Thay đổi mật khẩu thành công!',
    };
  }
}
