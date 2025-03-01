import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();

    return users.map((user) => ({
      name: user.name,
      email: user.email,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    if (req.user) {
      return {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      };
    }

    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') identifier: string) {
    const isValidMongoId = Types.ObjectId.isValid(identifier);

    if (isValidMongoId) {
      const userById = await this.usersService.findById(identifier);

      if (userById)
        return {
          _id: userById._id,
          name: userById.name,
          email: userById.email,
        };
    }

    const userByEmail = await this.usersService.findByEmail(identifier);

    if (userByEmail)
      return {
        _id: userByEmail._id,
        name: userByEmail.name,
        email: userByEmail.email,
      };

    throw new NotFoundException('User not found');
  }
}
