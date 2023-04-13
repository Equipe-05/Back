import { Role } from '@prisma/client';

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  salt?: string;
  cpf: string;
  address: string;
  phone: string;
  role: Role;
}
