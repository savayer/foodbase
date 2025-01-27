import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

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

  @Get(':email')
  getUser(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
