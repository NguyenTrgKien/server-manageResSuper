import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleUser, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/helper/bcrypt.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // Inject entity user
    private readonly userRepository: Repository<User>, // Dùng để thao tác với cơ sở dữ liệu
  ) {}
  async register(data: CreateUserDto) {
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
      isActive: false,
      role: role ?? RoleUser.USER, // Dùng để gán mặc định khi bên trái là null hoặc undefined
    };
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
    return await this.userRepository.findOne({ where: { id: userId } });
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
}
