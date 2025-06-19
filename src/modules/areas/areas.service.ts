import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}
  async createArea(createAreaDto: CreateAreaDto) {
    const { name, floor_number, description } = createAreaDto;
    const dataArea = {
      name: name,
      floor_number: floor_number,
      description: description,
    };
    const newArea = this.areaRepository.create(dataArea);
    await this.areaRepository.save(newArea);
    return {
      status: true,
      message: 'Thêm khu vực thành công',
    };
  }

  async deleteArea(areaId: number) {
    const area = await this.areaRepository.findOne({
      where: {
        id: areaId,
      },
    });
    if (!area) {
      throw new BadRequestException('Không tìm thấy khu vực này của nhà hàng!');
    }
    await this.areaRepository.delete(areaId);
    return {
      status: true,
      message: 'Xóa khu vực thành công!',
    };
  }

  async updateArea(dataUpdate: UpdateAreaDto) {
    const { id, ...rest } = dataUpdate;
    // Phương thức fromEntries() dùng để biến một mảng các cặp [key, value] thành một object
    const area = await this.areaRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!area) {
      throw new BadRequestException('Không tìm thấy khu vực này của nhà hàng!');
    }
    const update = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(rest).filter(([_, value]) => value !== undefined),
    );
    if (Object.keys(update).length === 0) {
      throw new BadRequestException('Không có dữ liệu nào để cập nhật!');
    }
    await this.areaRepository.update(area.id, update);
    return {
      status: true,
      message: 'Cập nhật khu vực thành công!',
    };
  }
}
