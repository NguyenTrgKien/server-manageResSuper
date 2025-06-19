import { Controller, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create-category')
  @Public()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Patch('/update-category')
  @Public()
  updateCategory(@Body() dataUpdate: UpdateCategoryDto) {
    return this.categoryService.updateCategory(dataUpdate);
  }

  @Delete('/delete-category/:categoryId')
  @Public()
  deleteTable(@Param('categoryId') categoryId: string) {
    return this.categoryService.deleteCategory(Number(categoryId));
  }
}
