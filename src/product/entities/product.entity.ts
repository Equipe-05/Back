import { Plan } from '@prisma/client';
import { Franchise } from 'src/franchise/entities/franchise.entity';

export class Product {
  id?: string;
  name: string;
  description: string;
  score: number;
  plan: Plan;
  franchises: Franchise[];
}
