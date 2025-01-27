import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { isValidObjectId } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  getDishes() {
    return this.dishesService.getDishes();
  }

  @Get(':id')
  async getDishById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const dish = await this.dishesService.getDish(id);

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return dish;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  createDish(@Body() dto: CreateDishDto) {
    return this.dishesService.createDish(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateDish(@Param('id') id: string, @Body() dto: UpdateDishDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const updatedDish = await this.dishesService.updateDish(id, dto);

    if (!updatedDish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return updatedDish;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteDish(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const deletedDish = await this.dishesService.deleteDish(id);

    if (!deletedDish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return 'ok';
  }
}
