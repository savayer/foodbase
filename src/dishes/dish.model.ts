import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import { User } from '../users/user.model';

@Schema({ timestamps: true })
export class Dish extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: MSchema.Types.ObjectId, ref: User.name, required: true })
  user_id: Types.ObjectId;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ default: false })
  isFavorite: boolean;

  @Prop()
  lastCooked?: Date;

  @Prop([String])
  tags?: string[];

  @Prop()
  category?: string;
}

export const DishSchema = SchemaFactory.createForClass(Dish);
