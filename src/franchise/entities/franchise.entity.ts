import { User } from 'src/user/entities/user.entity';

export class Franchise {
  id: string;
  name: string;
  address: string;
  cnpj: string;
  phone: string;
  costumers?: string;
  score: string;
  status: number;
  user?: User;
  customers?: string[]; // ! Customer is not implemented yet
  sales?: string[]; // ! Sale is not implemented yet
}
