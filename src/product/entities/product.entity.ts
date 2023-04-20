import { Plan } from '@prisma/client';
import { Franchise } from 'src/franchise/entities/franchise.entity';
import { Sale } from 'src/sale/entities/sale.entity';

export class Product {
  id?: string;
  name: string;
  description: string;
  score: number;
  plan: Plan;
  customers?: Franchise[];
  sales?: Sale[];
}
