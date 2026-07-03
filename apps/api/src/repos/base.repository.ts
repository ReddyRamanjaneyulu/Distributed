import { PrismaService } from '../prisma/prisma.service';

export abstract class BaseRepository<
  Delegate extends {
    create(args: any): Promise<any>;
    findUnique(args: any): Promise<any>;
    findMany(args?: any): Promise<any>;
    update(args: any): Promise<any>;
    delete(args: any): Promise<any>;
  },
> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: Delegate,
  ) {}

  async create(data: any) {
    return this.model.create({ data });
  }

  async findUnique(where: any) {
    return this.model.findUnique({ where });
  }

  async findMany(args?: any) {
    return this.model.findMany(args);
  }

  async update(where: any, data: any) {
    return this.model.update({
      where,
      data,
    });
  }

  async softDelete(where: any) {
    return this.model.update({
      where,
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async hardDelete(where: any) {
    return this.model.delete({
      where,
    });
  }
}