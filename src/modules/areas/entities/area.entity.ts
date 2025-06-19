import { Table } from 'src/modules/tables/entities/table.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Floor_Number {
  TANG1 = 'tang1',
  TANG2 = 'tang2',
  TANGVIP = 'tangvip',
}

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: Floor_Number, default: Floor_Number.TANG1 })
  floor_number: Floor_Number;

  @OneToMany(() => Table, (table) => table.area)
  table: Table[];
}
