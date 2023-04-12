import { Product } from 'src/product/entities/product.entity';

export class Franchise {
  id: number;
  name: string;
  address: string;
  cnpj: string;
  phone: string;
  costumers?: string;
  sales?: string;
  products: Product[];
  score: string;
  status: number;
}
