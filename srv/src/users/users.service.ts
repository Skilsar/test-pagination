import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  async findAll(page: number = 1, limit: number = 20): Promise<{ users: UsersEntity[]; total: number }> {
    const [users, total] = await this.usersRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { users, total };
  }
}
