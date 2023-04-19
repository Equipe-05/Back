export class Customer {
  id: string;
  name: string;
  address: string;
  cnpj: string;
  phone: string;
  franchises?: string[];
  sales?: string[]; // ! Sale is not implemented yet
  products?: string[];
}
