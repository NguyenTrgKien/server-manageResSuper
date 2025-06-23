import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Delete,
  Param,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { DishsService } from './dishs.service';
import { Public } from 'src/common/decorator/public.decorator';
import { CreateDishDto } from './dto/create-dish.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateDishDto } from './dto/update-dish.dto';
import { QueryDishDto } from './dto/query-dish.dto';

@Controller('dishs')
export class DishsController {
  constructor(private readonly dishsService: DishsService) {}

  @Post('/create-dish')
  @Public()
  // Cấu hình để nhận một mảng file hình ảnh từ client
  @UseInterceptors(FilesInterceptor('image'))
  createDish(
    @Body() data: CreateDishDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.dishsService.createDish(data, files);
  }

  @Get('/get-dishs')
  @Public()
  getDish(@Query() query: QueryDishDto) {
    return this.dishsService.getDish(query);
  }

  @Patch('/update-dish')
  @UseInterceptors(FilesInterceptor('images'))
  @Public()
  updateDish(
    @Body() dataUpdate: UpdateDishDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.dishsService.updateDish(dataUpdate, files);
  }

  @Delete('/delete-dish/:dishId')
  deleteDish(@Param('dishId') dishId: string) {
    return this.dishsService.deleteDish(Number(dishId));
  }
}
