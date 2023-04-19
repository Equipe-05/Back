import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetCustomerFilterDto } from './dto/get-customer-filter.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { isRole } from 'src/common/helpers/role-check.helper';
import { User } from 'src/user/entities/user.entity';

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

  async updateCustomer(id: string, payload: UpdateCustomerDto) {
    const where = { id };
    const { name, address, cnpj, phone } = payload;
    const data: Prisma.CustomerUpdateInput = {
      name,
      address,
      cnpj,
      phone,
    };

    return await this.prisma.customer.update({ where, data });
  }

  async findAllCustomers(payload: GetCustomerFilterDto, user: User) {
    const { search } = payload;
    const where: Prisma.CustomerWhereInput = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          cnpj: {
            contains: search,
          },
        },
      ];
    }

    if (isRole(user.role, Role.EMPLOYEE, Role.FRANCHISEE)) {
      const franchiseId = await this.prisma.franchise.findUnique({
        where: { userId: user.ownerId },
        select: { id: true },
      });
      if (franchiseId.id) {
        where.franchiseId = franchiseId.id;
      }
    }

    return this.prisma.customer.findMany({ where });
  }

  async findByIdCustomer(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async endCostumer(id: string) {
    await this.findOneById(id);
    const where = { id };
    const data: Prisma.CustomerUpdateInput = {
      deletedAt: new Date(),
    };

    return this.prisma.customer.update({ where, data });
  }

  private async findOneById(id: string) {
    const _customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!_customer) {
      throw {
        name: 'NotFound',
        message: 'Customer not found',
      };
    }
    return _customer;
  }
}
