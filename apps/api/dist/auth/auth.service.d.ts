import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(registerData: RegisterDto): Promise<AuthResponseDto>;
    login(loginData: LoginDto): Promise<AuthResponseDto>;
    refreshToken(oldRefreshToken: string): Promise<AuthResponseDto>;
}
