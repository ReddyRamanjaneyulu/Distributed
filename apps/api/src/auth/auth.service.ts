import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UsersRepository } from '../repos/users.repository';
import { RefreshTokensRepository } from '../repos/refresh-tokens.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async register(
    email: string,
    password: string,
  ) {
    const passwordHash =
      await bcrypt.hash(password, 10);

    return this.usersRepository.create(
      email,
      passwordHash,
    );
  }

  async login(
    email: string,
    password: string,
  ) {
    const user =
      await this.usersRepository.findByEmail(
        email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const valid =
      await bcrypt.compare(
        password,
        user.passwordHash,
      );

    if (!valid) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken =
      this.jwtService.sign(payload);

    const refreshToken =
      this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

    await this.refreshTokensRepository.create(
      user.id,
      refreshToken,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}