import { Customer } from 'src/customer/entities/customer.entity';
import { Sale } from 'src/sale/entities/sale.entity';
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
  customers?: Customer[];
  sales?: Sale[];
}
