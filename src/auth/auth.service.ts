import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    return await this.usersService.createUser(dto);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isCorrectPassword = await compare(dto.password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      access_token: await this.jwtService.signAsync({ email: user.email }),
    };
  }
}
