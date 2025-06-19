import { Controller, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { UpdateAreaDto } from './dto/update-area.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post('/create-area')
  @Public()
  createArea(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.createArea(createAreaDto);
  }

  @Delete('/delete-area/:areaId')
  @Public()
  deleteArea(@Param('areaId') areaId: string) {
    return this.areasService.deleteArea(Number(areaId));
  }

  @Patch('/update-area')
  @Public()
  updateArea(@Body() dataUpdate: UpdateAreaDto) {
    return this.areasService.updateArea(dataUpdate);
  }
}
