import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { isValidObjectId } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserDecorator } from '../decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getDishesByUserId(@UserDecorator() user) {
    return this.dishesService.getDishes(user._id);
  }

  @Get('public')
  getPublicDishes() {
    return this.dishesService.getPublicDishes();
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
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createDish(
    @Body() dto: CreateDishDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @UserDecorator() user,
  ) {
    return this.dishesService.createDish(
      {
        ...dto,
        user_id: user._id,
      },
      file,
    );
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
  async deleteDish(@Param('id') id: string, @UserDecorator() user) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }
    const dish = await this.dishesService.getDish(id);
    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    if (dish.user_id.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can only delete your own dishes');
    }

    const deletedDish = await this.dishesService.deleteDish(id);

    if (!deletedDish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Dish successfully deleted',
      deletedId: id,
    };
  }
}
