export class Customer {
  id: string;
  name: string;
  address: string;
  cnpj: string;
  phone: string;
  franchises?: Franchise[];
  sales?: string[]; // ! Sale is not implemented yet
  products?: string[];
}
