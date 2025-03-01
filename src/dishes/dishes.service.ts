import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Dish } from './dish.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateDishDto } from './dto/create-dish.dto';
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

  async getDishes(user_id: Types.ObjectId) {
    return this.dishModel.find({ user_id }).exec();
  }

  async getPublicDishes() {
    return this.dishModel.find({ isPublic: true }).exec();
  }

  async getDish(id: string) {
    return this.dishModel.findById(id).exec();
  }

  async createDish(dto: CreateDishDto, file: Express.Multer.File) {
    const fileName = this.filesService.processFileName(dto.name);
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

  async updateDish(
    id: string,
    dto: UpdateDishDto,
    file: Express.Multer.File | undefined,
  ) {
    if (file) {
      const existingDish = await this.dishModel.findById(id).exec();

      if (!existingDish) {
        throw new NotFoundException(`Dish with ID ${id} not found`);
      }

      if (existingDish.image) {
        try {
          await this.filesService.deleteImage(
            this.getFileNameFromUrl(existingDish.image),
          );
        } catch (error) {
          // @todo install logger?
          console.error(error);
        }
      }

      const fileName = this.filesService.processFileName(dto.name);
      const res = await this.filesService.uploadFile(file, fileName);

      if (res.$metadata.httpStatusCode === 200) {
        const imageUrl = `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get('AWS_S3_REGION')}.amazonaws.com/${fileName}`;

        return this.dishModel.findByIdAndUpdate(
          id,
          { ...dto, image: imageUrl },
          {
            new: true,
          },
        );
      }
    }

    return this.dishModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  async deleteDish(id: string) {
    const dish = await this.dishModel.findById(id).exec();

    if (dish.image) {
      const fileName = dish.image.split('/').pop();
      await this.filesService.deleteImage(fileName);
    }

    return this.dishModel.findByIdAndDelete(id).exec();
  }

  private getFileNameFromUrl(url: string) {
    return url.split('/').pop();
  }
}
