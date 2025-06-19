import { TableStatus, TableType } from '../entities/table.entity';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class UpdateTableDto {
  @IsNotEmpty({ message: 'Id của bàn không thể thiếu!' })
  id: number;

  @IsInt({ message: 'Sức chứa phải là một số nguyên' })
  @Min(1, { message: 'Sức chứa tối thiểu là một người' })
  @IsOptional()
  capacity: number;

  @IsEnum(TableType, { message: 'Loại bàn không hợp lệ' })
  @IsOptional()
  table_type: TableType;

  @IsEnum(TableStatus, { message: 'Trạng thái bàn không hợp lệ' })
  @IsOptional()
  table_status: TableStatus;

  @IsOptional()
  note: string;

  @IsInt({ message: 'Id khu vực phải là một số nguyên' })
  @IsOptional()
  areaId: number;
}
