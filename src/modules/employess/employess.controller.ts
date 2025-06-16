import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployessService } from './employess.service';
import { CreateEmployessDto } from './dto/create-employess.dto';
import { UpdateEmployessDto } from './dto/update-employess.dto';

@Controller('employess')
export class EmployessController {
  constructor(private readonly employessService: EmployessService) {}

  @Post()
  create(@Body() createEmployessDto: CreateEmployessDto) {
    return this.employessService.create(createEmployessDto);
  }

  @Get()
  findAll() {
    return this.employessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployessDto: UpdateEmployessDto) {
    return this.employessService.update(+id, updateEmployessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employessService.remove(+id);
  }
}
