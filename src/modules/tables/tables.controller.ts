import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { TablesService } from './tables.service';
import { Public } from 'src/common/decorator/public.decorator';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}
  @Post('/create-table')
  @Public()
  createTable(@Body() data: CreateTableDto) {
    return this.tablesService.createTable(data);
  }

  @Delete('/delete-table/:tableId')
  @Public()
  deleteTable(@Param('tableId') tableId: string) {
    return this.tablesService.deleteTable(Number(tableId));
  }

  @Patch('/update-table')
  @Public()
  updateTable(@Body() dataUpdate: UpdateTableDto) {
    return this.tablesService.updateTable(dataUpdate);
  }
}
