import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefreshTokensRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, token: string) {
    return this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
  }

  async findByToken(token: string) {
    return this.prisma.session.findFirst({
      where: {
        refreshTokenHash: token,
      },
    });
  }

  async delete(token: string) {
    return this.prisma.session.deleteMany({
      where: {
        refreshTokenHash: token,
      },
    });
  }

  async deleteByUserId(userId: string) {
    return this.prisma.session.deleteMany({
      where: {
        userId,
      },
    });
  }

  async deleteExpired() {
    return this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}