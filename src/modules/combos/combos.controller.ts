import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  Get,
} from '@nestjs/common';
import { CombosService } from './combos.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateComboDto } from './dto/update-combo.dto';
import { InActiveComboDto } from './dto/inactive-combo.dto';

@Controller('combos')
export class CombosController {
  constructor(private readonly combosService: CombosService) {}

  @Post('/create-combo')
  @Public()
  @UseInterceptors(FileInterceptor('image'))
  createCombo(
    @Body() dataCreateCombo: CreateComboDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.combosService.createCombo(dataCreateCombo, image);
  }

  @Patch('/update-combo')
  @Public()
  @UseInterceptors(FileInterceptor('image'))
  updateCombo(
    @Body() dataUpdateCombo: UpdateComboDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.combosService.updateCombo(dataUpdateCombo, image);
  }

  @Patch('/inactive-combo')
  @Public()
  inActive(@Body() body: InActiveComboDto) {
    return this.combosService.inActive(Number(body.id));
  }

  @Get('/get-combos')
  @Public()
  async getCombos() {
    return await this.combosService.getCombos();
  }
}
