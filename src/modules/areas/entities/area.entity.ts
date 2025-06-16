import { Table } from 'src/modules/tables/entities/table.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  floor_number: number;

  @OneToMany(() => Table, (table) => table.area)
  table: Table;
}
