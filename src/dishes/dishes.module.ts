import { Module } from '@nestjs/common';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DishSchema } from './dish.model';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Dish', schema: DishSchema }]),
    FilesModule,
  ],
  controllers: [DishesController],
  providers: [DishesService],
})
export class DishesModule {}
