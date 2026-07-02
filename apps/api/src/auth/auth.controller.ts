import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerData: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerData);
  }

  @Post('login')
  async login(@Body() loginData: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginData);
  }

  @Post('refresh-token')
  async refreshToken(@Body('oldRefreshToken') oldRefreshToken: string): Promise<AuthResponseDto> {
    return this.authService.refreshToken(oldRefreshToken);
  }
}