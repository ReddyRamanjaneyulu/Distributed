import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtStrategy } from '../auth/jwt.strategy';

import { UsersRepository } from '../repos/users.repository';
import { RefreshTokensRepository } from '../repos/refresh-tokens.repository';

@Module({
  imports: [
    ConfigModule,
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('JWT secret from config:', config.get<string>('jwt.secret'));
        return {
          secret: config.get<string>('jwt.secret'),
          signOptions: {
            expiresIn: config.get<string>('jwt.expiresIn'),
          },
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    UsersRepository,
    RefreshTokensRepository,
  ],

  exports: [
    JwtModule,
    PassportModule,
    AuthService,
  ],
})
export class AuthModule {}
