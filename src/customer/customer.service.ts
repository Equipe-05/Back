import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(payload: CreateCustomerDto) {
    const { name, address, cnpj, phone, franchiseId } = payload;
    const data: Prisma.CustomerCreateInput = {
      name,
      address,
      cnpj,
      phone,
      franchise: {
        connect: {
          id: franchiseId,
        },
      },
    };
    return await this.prisma.customer.create({ data });
  }

  // async updateCustomer(
  //   id: string,
  //   data: Prisma.CustomerUpdateInput,
  // ): Promise<Customer> {
  //   return this.prisma.customer.update({
  //     where: { id },
  //     data,
  //   });
  // }

  // async deleteCustomer(id: string): Promise<Customer> {
  //   return this.prisma.customer.delete({
  //     where: { id },
  //   });
  // }

  // async findAllCustomers(): Promise<Customer[]> {
  //   return this.prisma.customer.findMany();
  // }

  // async findByIdCustomer(id: string): Promise<Customer> {
  //   return this.prisma.customer.findUnique({
  //     where: { id },
  //   });
  // }
}
