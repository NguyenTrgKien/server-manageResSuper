import { Controller, Body } from '@nestjs/common';
import { DishimageService } from './dishimage.service';

@Controller('dishimage')
export class DishimageController {
  constructor(private readonly dishimageService: DishimageService) {}
}
