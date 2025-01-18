import { Module } from '@nestjs/common';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DishSchema } from './dish.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Dish', schema: DishSchema }])],
  controllers: [DishesController],
  providers: [DishesService],
})
export class DishesModule {}
