import { Role } from '@prisma/client';
import { Franchise } from 'src/franchise/entities/franchise.entity';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  salt?: string;
  cpf: string;
  address: string;
  phone: string;
  role: Role;
  franchise?: Franchise;
}
