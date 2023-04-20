import { Customer } from 'src/customer/entities/customer.entity';
import { Franchise } from 'src/franchise/entities/franchise.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

export class Sale {
  id?: string;
  description?: string;
  customer: Customer;
  franchise: Franchise;
  product: Product;
  user: User;
}
