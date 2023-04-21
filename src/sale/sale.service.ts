import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import {
  isNotRoleCheck,
  isRole,
  isRoleCheck,
} from 'src/common/helpers/role-check.helper';
import { GetSalesFilterDto } from './dto/get-sales-filter.dto';
import { User } from 'src/user/entities/user.entity';

const include = {
  customer: true,
  franchise: true,
  product: true,
  user: true,
};

const select = {
  id: true,
  description: true,
  customer: {
    select: {
      id: true,
    },
  },
  franchise: {
    select: {
      id: true,
    },
  },
  product: {
    select: {
      id: true,
    },
  },
  user: {
    select: {
      id: true,
    },
  },
};

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  async createSale(payload: CreateSaleDto) {
    const { customerId, description, franchiseId, productId, userId } = payload;
    isRoleCheck(await this.getUserRole(userId), Role.EMPLOYEE, Role.FRANCHISEE);
    await this.checkCustomerExists(customerId);
    await this.checkFranchiseExists(franchiseId);
    await this.checkProductExists(productId);

    const data: Prisma.SaleCreateInput = {
      description,
      customer: {
        connect: {
          id: customerId,
        },
      },
      franchise: {
        connect: {
          id: franchiseId,
        },
      },
      product: {
        connect: {
          id: productId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    };

    return this.prisma.sale.create({ data });
  }

  async getAllSales(search: GetSalesFilterDto, user: User) {
    const where: Prisma.SaleWhereInput = {};

    if (search?.search)
      where.description = {
        contains: search.search,
        mode: 'insensitive',
      };

    if (isRole(user.role, Role.FRANCHISEE)) {
      const _franchise = await this.findOneFranchiseByUserId(user.id);
      where.franchiseId = _franchise.id;
    }

    return this.prisma.sale.findMany({ where, select });
  }

  async getSalesByFranchise(franchiseId: string, user: User) {
    isNotRoleCheck(user.role, Role.EMPLOYEE);
    const where = { franchiseId };
    const _franchise = await this.findOneFranchiseByUserId(user.id);

    if (isRole(user.role, Role.FRANCHISEE)) {
      if (_franchise.id !== franchiseId)
        throw {
          name: 'UnauthorizedError',
          message: `You don't have permission to access this franchise sales`,
        };
    }

    return this.prisma.sale.findMany({ where, select });
  }

  async getSalesByCustomer(customerId: string, user: User) {
    const where: Prisma.SaleWhereInput = { customerId };

    if (isRole(user.role, Role.EMPLOYEE, Role.FRANCHISEE)) {
      const _franchise = await this.findOneFranchiseByUserId(user.ownerId);
      where.franchiseId = _franchise.id;
    }

    return this.prisma.sale.findMany({ where, select });
  }

  async getSalesByUser(userId: string, _user: User) {
    const where: Prisma.SaleWhereInput = { userId };

    if (isRole(_user.role, Role.EMPLOYEE, Role.FRANCHISEE)) {
      userId === _user.ownerId ? null : (where.userId = '');
    }

    return this.prisma.sale.findMany({ where, select });
  }

  async getSalesByProduct(productId: string, filter: GetSalesFilterDto) {
    const where: Prisma.SaleWhereInput = { productId };

    if (filter?.search)
      where.description = {
        contains: filter.search,
        mode: 'insensitive',
      };

    return this.prisma.sale.findMany({ where, select });
  }

  async getSaleById(id: string, user: User) {
    const sale = await this.findSaleById(id);

    if (isRole(user.role, Role.EMPLOYEE, Role.FRANCHISEE)) {
      if (sale.franchise.userId !== user.ownerId)
        throw {
          name: 'UnauthorizedError',
          message: `You don't have permission to access this sale`,
        };
    }

    return sale;
  }

  async updateSale(id: string, payload: UpdateSaleDto, user: User) {
    const { description } = payload;
    const where = { id };
    const _sale = await this.findSaleById(id);

    if (isRole(user.role, Role.FRANCHISEE)) {
      if (_sale.franchise.userId !== user.ownerId)
        throw {
          name: 'UnauthorizedError',
          message: `You don't have permission to update this sale`,
        };
    }

    const data: Prisma.SaleUpdateInput = {
      description,
    };

    return this.prisma.sale.update({ where, data });
  }

  async deleteSale(id: string) {
    const where = { id };
    const data: Prisma.SaleUpdateInput = {
      deletedAt: new Date(),
    };

    await this.prisma.sale.update({ where, data });
  }

  private async findSaleById(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: {
        id,
      },
      include,
    });

    if (!sale)
      throw {
        name: 'NotFoundError',
        message: `Sale with id ${id} not found`,
      };

    delete sale?.user?.password;

    return sale;
  }

  private async findOneFranchiseByUserId(userId: string) {
    const franchise = await this.prisma.franchise.findUnique({
      where: {
        userId,
      },
    });

    if (!franchise)
      throw {
        name: 'NotFoundError',
        message: `Franchise with user id ${userId} not found`,
      };

    return franchise;
  }

  private async getUserRole(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user)
      throw {
        name: 'NotFoundError',
        message: `User with id ${userId} not found`,
      };

    return user?.role;
  }

  private async checkProductExists(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product)
      throw {
        name: 'NotFoundError',
        message: `Product with id ${productId} not found`,
      };
  }

  private async checkFranchiseExists(franchiseId: string) {
    const franchise = await this.prisma.franchise.findUnique({
      where: {
        id: franchiseId,
      },
    });

    if (!franchise)
      throw {
        name: 'NotFoundError',
        message: `Franchise with id ${franchiseId} not found`,
      };
  }

  private async checkCustomerExists(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer)
      throw {
        name: 'NotFoundError',
        message: `Customer with id ${customerId} not found`,
      };
  }
}
