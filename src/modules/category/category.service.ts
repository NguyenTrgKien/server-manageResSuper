import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const category = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });
    if (category) {
      throw new BadRequestException('Danh mục đã tồn tại!');
    }
    const newCategory = this.categoryRepository.create({
      ...createCategoryDto,
    });
    await this.categoryRepository.save(newCategory);
    return {
      status: true,
      message: 'Thêm danh mục thành công!',
    };
  }

  async updateCategory(dataUpdate: UpdateCategoryDto) {
    const { id, ...rest } = dataUpdate;
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) {
      throw new BadRequestException('Không tìm thấy danh mục!');
    }
    const update = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(rest).filter(([_, value]) => value !== undefined),
    );
    if (Object.keys(update).length === 0) {
      throw new BadRequestException('Không có dữ liệu để cập nhật!');
    }
    await this.categoryRepository.update(category.id, update);
    return {
      status: true,
      message: 'Cập nhật danh mục thành công!',
    };
  }

  async deleteCategory(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      throw new BadRequestException('Không tìm thấy bàn!');
    }
    await this.categoryRepository.delete(category.id);
    return {
      status: true,
      message: 'Xóa danh mục thành công!',
    };
  }

  async findCategoryById(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: categoryId,
      },
    });
    return category;
  }
}
