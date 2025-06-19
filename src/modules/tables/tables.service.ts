import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { Repository } from 'typeorm';
import { Area } from '../areas/entities/area.entity';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,

    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}
  async createTable(data: CreateTableDto) {
    const { capacity, table_type, table_status, areaId, note } = data;
    const totalTables = await this.tableRepository.count();
    const nextNumber = totalTables + 1;
    const table_code = `TABLE${nextNumber.toString().padStart(3, '0')}`;
    const area = await this.areaRepository.findOne({
      where: {
        id: areaId,
      },
    });
    if (!area) {
      throw new BadRequestException('Khu vực nhà hàng không tồn tại!');
    }
    const dataTable = {
      table_code,
      capacity: capacity,
      table_type: table_type,
      table_status: table_status,
      area: area,
      note: note,
    };
    const newTable = this.tableRepository.create(dataTable);
    await this.tableRepository.save(newTable);
    return {
      status: true,
      message: 'Tạo bàn thành công!',
    };
  }

  async deleteTable(tableId: number) {
    const table = await this.tableRepository.findOne({
      where: {
        id: tableId,
      },
    });
    if (!table) {
      throw new BadRequestException('Không tìm thấy bàn!');
    }
    await this.tableRepository.delete(table.id);
    return {
      status: true,
      message: 'Xóa bàn thành công!',
    };
  }

  async updateTable(dataUpdate: UpdateTableDto) {
    const { id, ...rest } = dataUpdate;
    const table = await this.tableRepository.findOne({
      where: {
        id,
      },
    });
    if (!table) {
      throw new BadRequestException('Không tìm thấy bàn này!');
    }
    const update = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(rest).filter(([_, value]) => value !== undefined),
    );
    if (Object.keys(update).length === 0) {
      throw new BadRequestException('Không có dữ liệu nào để cập nhật!');
    }
    await this.tableRepository.update(id, update);
    return {
      status: true,
      message: 'Cập nhật thông tin bàn thành công!',
    };
  }
}
