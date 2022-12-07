import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      select: ['id', 'uuid', 'email', 'name', 'phone'],
    });
  }

  async create(data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.userRepository.create(data);

    return await this.userRepository.save(user);
  }
}
