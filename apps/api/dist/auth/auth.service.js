"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../users/user.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    userService;
    jwtService;
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async register(registerData) {
        const existingUser = await this.userService.findByEmail(registerData.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const user = await this.userService.create({
            email: registerData.email,
            password: registerData.password,
        });
        const payload = {
            email: user.email,
            sub: user.id,
        };
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
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }
    async login(loginData) {
        const user = await this.userService.findByEmail(loginData.email);
        if (!user || !(await bcrypt.compare(loginData.password, user.passwordHash))) {
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
    async refreshToken(oldRefreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(oldRefreshToken);
            const user = await this.userService.findById(payload.sub);
            if (!user) {
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
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map