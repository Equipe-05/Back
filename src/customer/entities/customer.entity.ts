import { Franchise } from "src/franchise/entities/franchise.entity";
import { Product } from "src/product/entities/product.entity";

export class Customer {
  id: string;
  name: string;
  address: string;
  cnpj: string;
  phone: string;
  franchises?: Franchise[];
  sales?: string[]; // ! Sale is not implemented yet
  products?: Product[];
}
