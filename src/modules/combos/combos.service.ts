import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateComboDto, DishComboDto } from './dto/create-combo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Combo } from './entities/combo.entity';
import { DataSource, Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DishsService } from '../dishs/dishs.service';
import { ComboItemService } from '../combo_item/combo_item.service';
import { UpdateComboDto } from './dto/update-combo.dto';

@Injectable()
export class CombosService {
  constructor(
    @InjectRepository(Combo)
    private readonly comboRepository: Repository<Combo>,
    private dataSource: DataSource,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dishService: DishsService,
    private readonly comboItemService: ComboItemService,
  ) {}
  async createCombo(
    dataCreateCombo: CreateComboDto,
    image: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (!image) {
        throw new BadRequestException('Combo phải có một hình ảnh!');
      }
      const uploadResult = await this.cloudinaryService.uploadSingleFile(image);
      const totalCombo = await this.comboRepository.count();
      const nextCombo = `CB_${(totalCombo + 1).toString().padStart(4, '0')}`;
      const newCombo = queryRunner.manager.create(Combo, {
        ...dataCreateCombo,
        combo_code: nextCombo,
        image: uploadResult.url,
        publicId: uploadResult.publicId,
        is_Actice: true,
      });
      await queryRunner.manager.save(newCombo);

      const dishList = JSON.parse(dataCreateCombo.dish) as DishComboDto[];
      for (const item of dishList) {
        const dish = await this.dishService.finDishById(Number(item.dishId));
        await this.comboItemService.createComboItem(
          {
            combo: newCombo,
            quantity: item.quantity,
            note: item.note || '',
            dish: dish,
          },
          queryRunner.manager,
        );
      }
      await queryRunner.commitTransaction();
      return {
        status: true,
        message: 'Tạo combo thành công!',
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xãy ra không thể tạo combo!',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateCombo(dataComboItem: UpdateComboDto, image: Express.Multer.File) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { id, ...dataUpdate } = dataComboItem;
      const combo = await this.comboRepository.findOne({
        where: {
          id,
        },
        relations: ['comboitem', 'comboitem.dish'],
      });
      if (!combo) {
        throw new BadRequestException('Không tìm thấy combo này!');
      }
      const isUpdateCombo = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(dataUpdate).filter(([_, value]) => value !== undefined),
      );
      const dataUpdateComboPromise: Partial<Combo> = isUpdateCombo;
      if (image) {
        const uploadResult =
          await this.cloudinaryService.uploadSingleFile(image);
        dataUpdateComboPromise.publicId = uploadResult.publicId;
        dataUpdateComboPromise.image = uploadResult.url;
      }
      const newUpdateCombo = await queryRunner.manager.save(Combo, {
        id: combo.id,
        ...dataUpdateComboPromise,
      });
      if (combo.comboitem.length > 0) {
        const isUpdateDishList = !!dataUpdate.dish;
        if (isUpdateDishList) {
          const dishListUpdate = JSON.parse(dataUpdate.dish) as DishComboDto[];
          if (dishListUpdate.length > 0) {
            for (const item of dishListUpdate) {
              const dish = await this.dishService.finDishById(item.dishId);
              if (!dish) {
                throw new BadRequestException('Không tìm thấy món ăn này!');
              }
              await this.comboItemService.updateDishList(
                {
                  comboitem: combo.comboitem,
                  combo: newUpdateCombo.id,
                  dish: dish,
                  note: item.note || '',
                  quantity: item.quantity,
                },
                queryRunner.manager,
              );
            }
          }
        }
      }
      await queryRunner.commitTransaction();
      return {
        status: true,
        message: 'Cập nhật combo thành công!',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã xảy ra lỗi, không thể cập nhật thông tin comboi!',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async inActive(comboId: number) {
    const combo = await this.comboRepository.findOne({
      where: {
        id: comboId,
      },
    });
    if (!combo) {
      throw new BadRequestException('Không tìm thấy combo này!');
    }
    await this.comboRepository.update(combo.id, {
      is_Actice: false,
    });
    return {
      status: true,
      message: 'Ngừng hoạt động combo này thành công!',
    };
  }

  async getCombos() {
    const combos = await this.comboRepository.find({
      relations: ['comboitem', 'comboitem.dish'],
    });
    return {
      status: true,
      message: 'Lấy danh sách combo thành công!',
      combos: combos,
    };
  }
}
