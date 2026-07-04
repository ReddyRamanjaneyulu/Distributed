import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './decorators/dto/register.dto';
import { LoginDto } from './decorators/dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
  ) {
    return this.authService.register(
      dto.email,
      dto.password,
    );
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
  ) {
    return this.authService.login(
      dto.email,
      dto.password,
    );
  }
}