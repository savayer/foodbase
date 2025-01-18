import { Injectable } from '@nestjs/common';
import { Dish } from './dish.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishesService {
  constructor(@InjectModel('Dish') private readonly dishModel: Model<Dish>) {}

  async getDishes() {
    return this.dishModel.find().exec();
  }

  async getDish(id: string) {
    return this.dishModel.findById(id).exec();
  }

  async createDish(dto: CreateDishDto) {
    return this.dishModel.create(dto);
  }

  async updateDish(id: string, dto: UpdateDishDto) {
    return this.dishModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  async deleteDish(id: string) {
    return this.dishModel.findByIdAndDelete(id).exec();
  }
}
