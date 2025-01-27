import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Types } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();

    return users.map((user) => ({
      name: user.name,
      email: user.email,
    }));
  }

  @Get(':id')
  async getUser(@Param('id') identifier: string) {
    const isValidMongoId = Types.ObjectId.isValid(identifier);

    if (isValidMongoId) {
      const userById = await this.usersService.findById(identifier);

      if (userById) return userById;
    }

    const userByEmail = await this.usersService.findByEmail(identifier);
    if (userByEmail) return userByEmail;

    throw new NotFoundException('User not found');
  }
}
