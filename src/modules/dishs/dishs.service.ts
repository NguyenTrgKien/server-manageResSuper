import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { CreateDishDto } from './dto/create-dish.dto';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DishimageService } from '../dishimage/dishimage.service';
import { UpdateDishDto } from './dto/update-dish.dto';
import { QueryDishDto } from './dto/query-dish.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class DishsService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dishimageService: DishimageService,
  ) {}

  async createDish(data: CreateDishDto, files: Express.Multer.File[]) {
    if (!files || !files.length) {
      throw new BadRequestException(
        'Vui lòng tải lên ít nhất một hình ảnh món ăn!',
      );
    }
    const {
      name,
      description,
      price,
      cost_price,
      proccessing_time,
      categoryId,
    } = data;
    const categoryCode =
      await this.categoryService.findCategoryById(categoryId);
    if (!categoryCode) {
      throw new BadRequestException('Danh mục không tồn tại!');
    }
    const totalDish = await this.dishRepository.count();
    const nextDish = `${categoryCode.code}_${totalDish.toString().padStart(4, '0')}`;

    const newDish = this.dishRepository.create({
      name,
      description,
      price,
      cost_price,
      proccessing_time,
      dish_code: nextDish,
      category: categoryCode,
    });

    const dish = await this.dishRepository.save(newDish);
    const images_urls = await this.cloudinaryService.uploadMultipleFile(files);
    const createImage = await this.dishimageService.createImage(
      images_urls,
      dish,
    );
    if (createImage.status) {
      return {
        status: true,
        message: 'Tạo món ăn thành công!',
      };
    }
    return {
      status: false,
      message: 'Tạo món ăn thất bại!',
    };
  }

  async getDish(query: QueryDishDto) {
    const { keyword = '', page = 1, limit = 10, categoryId } = query;
    const where: FindOptionsWhere<Dish> = {}; // Tạo một object rỗng để chứa các điều kiện truy vấn
    // FindOptionWhere<Dish> là kiểu dữ liệu tương ứng với entiry 'Dish'
    if (keyword) {
      where.name = Like(`%${keyword}%`); // Tìm món ăn theo tên , sử dụng  LIKE trong sql
    }
    if (categoryId) {
      where.category = { id: categoryId };
    }

    const [data, total] = await this.dishRepository.findAndCount({
      where,
      skip: (page - 1) * limit, // Bỏ qua 0 dòng để lấy bắt đầu từ dòng thứ 1
      take: limit, // Lấy tố đa 10 dòng
      order: {
        id: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async updateDish(dataUpdate: UpdateDishDto, files: Express.Multer.File[]) {
    const { id, oldPublicIdImages, ...rest } = dataUpdate;
    const dish = await this.dishRepository.findOne({
      where: {
        id,
      },
    });
    if (!dish) {
      throw new BadRequestException('Không tìm thấy món ăn này!');
    }
    await this.dishRepository.update(dish.id, {
      ...rest,
    });
    try {
      await this.dishimageService.updateImages(oldPublicIdImages, files);
      return {
        status: true,
        message: 'Cập nhật món ăn thành công!',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(
          error.message || 'Không có hình cũ nào để thay thế!',
        );
      }
    }
  }

  async deleteDish(dishId: number) {
    const dish = await this.dishRepository.findOne({
      where: {
        id: dishId,
      },
    });
    if (!dish) {
      throw new BadRequestException('Không tìm thấy món ăn này!');
    }
    const images = await this.dishimageService.findImageByDishId(dish);
    if (images.status) {
      const listImage = images?.images
        ? images.images.map((image) => image)
        : [];
      await this.dishimageService.deleteImages(listImage);
    }
    await this.dishRepository.delete(dish.id);
    return {
      status: true,
      message: 'Xóa món ăn thành công!',
    };
  }
}
