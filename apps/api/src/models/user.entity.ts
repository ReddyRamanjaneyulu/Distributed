import { User, Role } from '@prisma/client';

export class UserEntity implements User {
  id!: string;
  email!: string;
  name: string | null = null;
  passwordHash!: string;
  role!: Role;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt: Date | null = null;
}

export interface CreateUserData {
  email: string;
  passwordHash: string;
  name?: string;
  role?: Role;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  passwordHash?: string;
  role?: Role;
}