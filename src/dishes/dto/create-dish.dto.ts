// dishes/dto/create-dish.dto.ts
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IngredientDto } from './ingredient.dto';

export class CreateDishDto {
  name: string;
  description?: string;
  isPublic?: boolean;
  isFavorite?: boolean;

  @Type(() => IngredientDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  ingredients?: IngredientDto[];

  user_id: string;
}

export class HttpCreateDishDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === 1) return true;
    if (value === 'false' || value === 0) return false;

    return value;
  })
  isPublic?: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === 1) return true;
    if (value === 'false' || value === 0) return false;

    return value;
  })
  isFavorite?: boolean = false;

  /*
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  category?: string;
*/

  @IsString()
  @IsOptional()
  ingredients?: string;
}
