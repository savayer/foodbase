import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { GoogleAuthGuard } from './guards/google.guard';

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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res) {
    const data = await this.authService.googleLogin(req);

    if (data.access_token && data.user) {
      res.redirect(
        `http://localhost:3001/api/auth/callback?access_token=${data.access_token}&user=${JSON.stringify(data.user)}`,
      );
    }
  }
}
