import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerData: RegisterDto): Promise<AuthResponseDto>;
    login(loginData: LoginDto): Promise<AuthResponseDto>;
    refreshToken(oldRefreshToken: string): Promise<AuthResponseDto>;
}
