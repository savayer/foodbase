import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (user) {
      throw new BadRequestException('This user email already been registered.');
    }

    return await this.authService.register(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  @Throttle({
    default: {
      ttl: 60 * 1000,
      limit: 3,
    },
  })
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @Post('google/login')
  googleLogin(
    @Body() data: { id: string; name: string; email: string; image: string },
  ) {
    return this.authService.googleLogin(data);
  }
}
