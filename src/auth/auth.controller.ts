import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async register(@Body() dto: RegisterDto) {
    const user = this.usersService.findByEmail(dto.email);

    if (user) {
      throw new BadRequestException('This user email already registered.');
    }

    return await this.authService.register(dto);
  }
}
