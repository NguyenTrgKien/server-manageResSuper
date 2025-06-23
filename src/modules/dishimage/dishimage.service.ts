import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dishimage } from './entities/dishimage.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { Dish } from '../dishs/entities/dish.entity';
import {
  CloudinaryResponse,
  CloudinaryService,
} from 'src/cloudinary/cloudinary.service';

@Injectable()
export class DishimageService {
  constructor(
    @InjectRepository(Dishimage)
    private readonly dishImageRepository: Repository<Dishimage>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async createImage(
    images: CloudinaryResponse[],
    dish: Dish,
    manager?: EntityManager,
  ) {
    const createImages = images.map((image) => ({
      image_url: image.url,
      dish: dish,
      publicId: image.publicId,
    }));
    if (manager) {
      await manager.insert(Dishimage, createImages);
    } else {
      await this.dishImageRepository.insert(createImages);
    }
    return {
      status: true,
      message: 'Thêm hình ảnh thành công!',
    };
  }

  async findImageByDishId(dish: Dish) {
    const images = await this.dishImageRepository.find({
      where: {
        dish: dish,
      },
    });
    if (!images.length) {
      return {
        status: false,
        message: 'Không có hình ảnh nào!',
      };
    }
    return {
      status: true,
      images,
    };
  }

  async deleteImages(listImage: Dishimage[]) {
    if (!listImage.length) {
      return {
        status: false,
        message: 'Không có hình ảnh phù hợp để xóa!',
      };
    }
    const listImageId = listImage.map((image) => image.id);
    await this.dishImageRepository.delete(listImageId);
    await this.cloudinaryService.deleteFiles(
      listImage.map((image) => image.publicId),
    );
    return {
      status: true,
      message: 'Xóa danh sách hình ảnh thành công!',
    };
  }

  async updateImages(
    oldPublicIdImages: string[] | undefined,
    files: Express.Multer.File[],
  ) {
    if (!oldPublicIdImages?.length) {
      return {
        status: false,
        message: 'Không có hình ảnh để cập nhật!',
      };
    }
    if (oldPublicIdImages.length !== files.length) {
      throw new BadRequestException('Số lượng ảnh cũ và ảnh mới không khớp!');
    }
    // Tìm các bảng ghi hình ảnh cũ từ DB
    const images = await this.dishImageRepository.findBy({
      publicId: In(oldPublicIdImages),
    });
    if (!images.length) {
      throw new NotFoundException(
        'Không tìm thấy hình ảnh cũ nào để cập nhật!',
      );
    }
    const newUploads = await this.cloudinaryService.uploadMultipleFile(files);
    const update = images.map(async (image, index: number) => {
      await this.dishImageRepository.update(image.id, {
        image_url: newUploads[index].url,
        publicId: newUploads[index].publicId,
      });
    });
    await Promise.all(update);
    await this.cloudinaryService.deleteFiles(oldPublicIdImages);
    return {
      status: true,
      message: 'Cập nhật hình ảnh thành công!',
    };
  }
}
