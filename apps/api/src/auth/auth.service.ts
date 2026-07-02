import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerData: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userService.findByEmail(registerData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    const user = await this.userService.create({
      email: registerData.email,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: 3600, // 1 hour
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: 604800, // 7 days
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: { id: user.id, email: user.email },
    };
  }

  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findByEmail(loginData.email);
    if (!user || !(await bcrypt.compare(loginData.password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: 3600,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: 604800,
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: { id: user.id, email: user.email },
    };
  }

  async refreshToken(oldRefreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync(oldRefreshToken);
      const user = await this.userService.findById(payload.sub);

      if (!user || user.deletedAt) {
        throw new Error('Invalid refresh token');
      }

      const newPayload = { email: user.email, sub: user.id };
      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: 3600,
      });
      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: 604800,
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: { id: user.id, email: user.email },
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}