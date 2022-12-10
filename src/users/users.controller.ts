import { Body, Controller, Get, OnModuleInit, Post } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { User } from './interfaces/users.interface';

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
  index(): Observable<User[]> {
    return this.cliente.send('find-all-user', {});
  }

  @Post()
  create(@Body() data: any): Observable<User> {
    return this.cliente.send('create-user', data);
  }
}
