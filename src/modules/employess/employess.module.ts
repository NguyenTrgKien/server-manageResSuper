import { Module } from '@nestjs/common';
import { EmployessService } from './employess.service';
import { EmployessController } from './employess.controller';

@Module({
  controllers: [EmployessController],
  providers: [EmployessService],
})
export class EmployessModule {}
