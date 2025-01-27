// dishes/dto/create-dish.dto.ts
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateDishDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = false;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean = false;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  category?: string;
}

export interface CreateDishWithUser extends CreateDishDto {
  user: Types.ObjectId;
}
