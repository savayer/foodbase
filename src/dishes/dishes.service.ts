import { BadRequestException, Injectable } from '@nestjs/common';
import { Dish } from './dish.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDishWithUser } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { FilesService } from '../files/files.service';
import { ConfigService } from '@nestjs/config';
import slugify from 'slugify';

@Injectable()
export class DishesService {
  constructor(
    @InjectModel('Dish') private readonly dishModel: Model<Dish>,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  async getDishes() {
    return this.dishModel.find().exec();
  }

  async getPublicDishes() {
    return this.dishModel.find({ isPublic: true }).exec();
  }

  async getDish(id: string) {
    return this.dishModel.findById(id).exec();
  }

  async createDish(dto: CreateDishWithUser, file: Express.Multer.File) {
    const fileName = `${Date.now()}-${slugify(dto.name, { lower: true })}`;
    const res = await this.filesService.uploadFile(file, fileName);

    if (res.$metadata.httpStatusCode === 200) {
      const imageUrl = `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get('AWS_S3_REGION')}.amazonaws.com/${fileName}`;

      return this.dishModel.create({
        ...dto,
        image: imageUrl,
      });
    }

    throw new BadRequestException('Failed to upload image');
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
