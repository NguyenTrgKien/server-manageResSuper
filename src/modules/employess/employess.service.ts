import { Injectable } from '@nestjs/common';
import { CreateEmployessDto } from './dto/create-employess.dto';
import { UpdateEmployessDto } from './dto/update-employess.dto';

@Injectable()
export class EmployessService {
  create(createEmployessDto: CreateEmployessDto) {
    return 'This action adds a new employess';
  }

  findAll() {
    return `This action returns all employess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employess`;
  }

  update(id: number, updateEmployessDto: UpdateEmployessDto) {
    return `This action updates a #${id} employess`;
  }

  remove(id: number) {
    return `This action removes a #${id} employess`;
  }
}
