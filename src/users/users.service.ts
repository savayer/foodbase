import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { RegisterDto } from '../auth/dto/register.dto';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(dto: RegisterDto) {
    const salt = genSaltSync(10);
    const newUser = new this.userModel({
      name: dto.name,
      email: dto.email,
      passwordHash: hashSync(dto.password, salt),
    });

    return newUser.save();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async getAllUsers() {
    return await this.userModel.find().exec();
  }
}
