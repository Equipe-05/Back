import { Franchise } from 'src/franchise/entities/franchise.entity';
import { Product } from 'src/product/entities/product.entity';
import { Sale } from 'src/sale/entities/sale.entity';

export class Customer {
  id: string;
  name: string;
  address: string;
  cnpj: string;
  phone: string;
  franchises?: Franchise[];
  sales?: Sale[];
  products?: Product[];
}
