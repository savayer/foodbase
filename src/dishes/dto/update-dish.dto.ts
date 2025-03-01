import { PartialType } from '@nestjs/mapped-types';
import { CreateDishDto, HttpCreateDishDto } from './create-dish.dto';

export class HttpUpdateDishDto extends PartialType(HttpCreateDishDto) {}
export class UpdateDishDto extends PartialType(CreateDishDto) {}
