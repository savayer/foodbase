import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createOneUser(name: string, email: string, password: string) {
    const newUser = new this.userModel({
      name,
      email,
      password,
    });
    const result = await newUser.save();

    return result.id as string;
  }

  async getAllUsers() {
    const users = await this.userModel.find().exec();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }

  /**
   * Get One User
   * @param userId
   */
  async getOneUser(userId: string) {
    const user = await this.findUser(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async updateUser(
    userId: string,
    name: string,
    email: string,
    password: string,
  ) {
    const modUser = await this.findUser(userId);

    // Only modify Values passed
    if (name) modUser.name = name;
    if (email) modUser.email = email;
    if (password) modUser.password = password;

    modUser.save();
  }

  async deleteUser(userId: string) {
    const result = await this.userModel.deleteOne({ _id: userId }).exec();

    if (result['n'] === 0) {
      throw new NotFoundException('Could not find user.');
    }
  }

  private async findUser(id: string): Promise<User> {
    let user: any;
    try {
      user = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find user.', error);
    }

    if (!user) {
      throw new NotFoundException('Could not find user.');
    }

    return user;
  }
}
