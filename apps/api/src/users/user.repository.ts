import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    return this.findOne({ where: { id } });
  }

  async create(payload: Partial<User>): Promise<User> {
    return await this.save(this.create(payload));
  }
}