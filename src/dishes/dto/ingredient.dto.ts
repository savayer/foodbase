import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  amount?: string;

  @IsString()
  @IsOptional()
  unit?: string;
}
