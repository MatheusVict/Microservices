import { IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  password: string;
}
