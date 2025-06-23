import { Injectable } from '@nestjs/common';
import { Combo } from '../combos/entities/combo.entity';
import { Dish } from '../dishs/entities/dish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ComboItem } from './entities/combo_item.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ComboItemService {
  constructor(
    @InjectRepository(ComboItem)
    private readonly comboItemRepository: Repository<ComboItem>,
  ) {}
  async createComboItem(
    {
      combo,
      quantity,
      note,
      dish,
    }: {
      combo: Combo; // Lấy id của combo
      quantity: number;
      note: string;
      dish: Dish; // Lấy id của dish
    },
    manager?: EntityManager,
  ) {
    const dataComboItem = {
      quantity,
      note,
      dish,
      combo,
    };
    if (manager) {
      const newComboItem = manager.create(ComboItem, dataComboItem);
      await manager.save(newComboItem);
    } else {
      const newComboItem = this.comboItemRepository.create(dataComboItem);
      await this.comboItemRepository.save(newComboItem);
    }
    return {
      status: true,
      message: 'Tạo comboitem thành công!',
    };
  }

  async updateDishList(
    {
      comboitem,
      combo,
      quantity,
      note,
      dish,
    }: {
      comboitem: ComboItem[];
      combo: number; // Lấy id của combo
      quantity: number | undefined;
      note: string;
      dish: Dish; // Lấy id của dish
    },
    manager?: EntityManager,
  ) {
    console.log(comboitem);
    const existComboItem = comboitem.find(
      (comboitem) => comboitem.dish.id === dish.id,
    );
    if (existComboItem) {
      existComboItem.quantity = quantity ?? existComboItem.quantity;
      existComboItem.note = note;
      if (manager) {
        await manager.save(ComboItem, existComboItem);
      } else {
        await this.comboItemRepository.save(existComboItem);
      }
    } else {
      const newComboItem = {
        combo: { id: combo } as Combo,
        quantity: quantity ?? 1,
        note,
        dish,
      };
      if (manager) {
        const created = manager.create(ComboItem, newComboItem);
        await manager.save(created);
      } else {
        const created = this.comboItemRepository.create(newComboItem);
        await this.comboItemRepository.save(created);
      }
    }
    return {
      status: true,
      message: 'Cập nhật dish trong comboitem thành công!',
    };
  }
}
