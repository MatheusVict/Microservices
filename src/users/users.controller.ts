import { Body, Controller, Get, OnModuleInit, Post } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserEntity } from './entities/users.entity';

@Controller('users')
export class UsersController implements OnModuleInit {
  @Client({
    // Toda configuração dos microservices
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'user-consumer',
        allowAutoTopicCreation: true,
      },
    },
  })
  private readonly cliente: ClientKafka; // Atribuindo ele a um atributo

  async onModuleInit() {
    const requestPatters = ['find-all-user', 'create-user'];

    requestPatters.forEach(async (pattern) => {
      this.cliente.subscribeToResponseOf(pattern);
      await this.cliente.connect();
    });
  }

  @Get()
  index(): Observable<UserEntity[]> {
    return this.cliente.send('find-all-user', {});
  }

  @Post()
  create(@Body() data: CreateUserDTO): Observable<UserEntity> {
    return this.cliente.send('create-user', data);
  }
}
