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
import { HttpCreateDishDto } from './dto/create-dish.dto';
import { HttpUpdateDishDto, UpdateDishDto } from './dto/update-dish.dto';
import { isValidObjectId } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserDecorator } from '../decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { IngredientDto } from './dto/ingredient.dto';

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
    @Body() httpDto: HttpCreateDishDto,
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
    let ingredients: IngredientDto[] = [];
    if (httpDto.ingredients) {
      try {
        ingredients = JSON.parse(httpDto.ingredients);
      } catch (e) {
        console.error(e);
        throw new BadRequestException('Invalid ingredients format');
      }
    }

    return this.dishesService.createDish(
      {
        ...httpDto,
        ingredients,
        user_id: user._id,
      },
      file,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateDish(
    @Param('id') id: string,
    @Body() dto: HttpUpdateDishDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID');
    }

    let ingredients: IngredientDto[] = [];
    if (dto.ingredients) {
      try {
        ingredients = JSON.parse(dto.ingredients);
      } catch (e) {
        console.error(e);
        throw new BadRequestException('Invalid ingredients format');
      }
    }

    const updatedDish = await this.dishesService.updateDish(
      id,
      {
        ...dto,
        ingredients,
      },
      file,
    );

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
