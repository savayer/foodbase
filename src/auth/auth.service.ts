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
    const user = await this.usersService.createUser(dto);

    return {
      name: user.name,
      email: user.email,
    };
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
      access_token: await this.jwtService.signAsync({
        id: user._id,
        email: user.email,
      }),
    };
  }

  async googleLogin(data: {
    id: string;
    name: string;
    email: string;
    image: string;
  }) {
    if (!data) {
      return 'No data';
    }

    const { email, name, id } = data;

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.createOAuthUser({
        name,
        email,
        password: null,
        googleId: id,
      });
    } else {
      user = await this.usersService.updateUser(email, {
        name,
        email,
        password: null,
        googleId: id,
      });
    }

    const payload = {
      _id: user.id,
      email: user.email,
      name: user.name,
    };

    const jwt = await this.jwtService.signAsync(payload);

    return {
      access_token: jwt,
      user,
    };
  }
}
