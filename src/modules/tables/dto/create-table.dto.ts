import { TableStatus, TableType } from '../entities/table.entity';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateTableDto {
  @IsInt({ message: 'Sức chứa phải là một số nguyên' })
  @Min(1, { message: 'Sức chứa tối thiểu là một người' })
  @IsNotEmpty({ message: 'Sức chứa của bàn không thể để trống' })
  capacity: number;

  @IsEnum(TableType, { message: 'Loại bàn không hợp lệ' })
  @IsNotEmpty({ message: 'Loại bàn không được để trống' })
  table_type: TableType;

  @IsEnum(TableStatus, { message: 'Trạng thái bàn không hợp lệ' })
  @IsNotEmpty({ message: 'Trạng thái bàn không được để trống' })
  table_status: TableStatus;

  @IsOptional()
  note: string;

  @IsInt({ message: 'Id khu vực phải là một số nguyên' })
  @IsNotEmpty({ message: 'Id khu vực bàn không được để trống' })
  areaId: number;
}
