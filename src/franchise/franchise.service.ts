import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { isRoleCheck } from 'src/common/helpers/role-check.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { GetFranchiseFilterDto } from './dto/get-franchises-filter.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';

const select = {
  id: true,
  name: true,
  address: true,
  cnpj: true,
  phone: true,
  score: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
  _count: {
    select: {
      sales: true,
    },
  },
  createdAt: true,
  deletedAt: true,
};

@Injectable()
export class FranchiseService {
  constructor(private readonly prisma: PrismaService) {}

  async createFranchise(payload: CreateFranchiseDto) {
    const { name, address, cnpj, phone } = payload;
    const data: Prisma.FranchiseCreateInput = {
      name,
      address,
      cnpj,
      phone,
    };

    return await this.prisma.franchise.create({ data, select });
  }

  async getAllFranchises(payload: GetFranchiseFilterDto) {
    const { minscore, maxscore, ordered, search, deleted } = payload;
    const where: Prisma.FranchiseWhereInput = {};
    const orderBy: Prisma.FranchiseOrderByWithAggregationInput = {};

    if (minscore && maxscore) {
      where.score = {
        gte: minscore,
        lte: maxscore,
      };
    } else if (minscore) {
      where.score = {
        gte: minscore,
      };
    } else if (maxscore) {
      where.score = {
        lte: maxscore,
      };
    }

    if (ordered) {
      orderBy.score = ordered;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          address: {
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

    if (deleted) {
      deleted === 'TRUE'
        ? (where.deletedAt = { not: null })
        : (where.deletedAt = null);
    }

    return this.prisma.franchise.findMany({ where, orderBy, select });
  }

  async getMyFranchise(id: string) {
    const where: Prisma.FranchiseWhereInput = { userId: id };
    return this.prisma.franchise.findMany({ where, select });
  }

  async getFranchiseById(id: string) {
    return this.findOneByIdWithUser(id);
  }

  async updateFranchise(id: string, payload: UpdateFranchiseDto) {
    const where = { id };
    const { name, address, cnpj, phone } = payload;
    const data: Prisma.FranchiseUpdateInput = {
      name,
      address,
      cnpj,
      phone,
    };

    return await this.prisma.franchise.update({ where, data });
  }

  async setFranchiseOwner(id: string, userId: string) {
    const where = { id };
    const userRole = await this.getUserRoleById(userId);
    isRoleCheck(userRole, Role.FRANCHISEE);
    const data: Prisma.FranchiseUpdateInput = {
      user: {
        connect: {
          id: userId,
        },
      },
    };

    await this.prisma.user.update({
      where: { id: userId },
      data: { ownerId: userId },
    });

    return this.prisma.franchise.update({ where, data, select });
  }

  async updateFranchiseScore(id: string) {
    const _franchise = await this.findOneByIdWithSales(id);
    const _sales = _franchise.sales;
    const _scores = _sales.map(async (sale) =>
      this.getScoreByProductId(sale.productId),
    );
    const scores = await Promise.all(_scores);
    const score = scores.reduce((acc, cur) => acc + cur, 0);
    const where = { id };
    const data: Prisma.FranchiseUpdateInput = {
      score,
    };

    return this.prisma.franchise.update({ where, data, select });
  }

  async endFranchise(id: string) {
    await this.findOneById(id);
    const where = { id };
    const data: Prisma.FranchiseUpdateInput = {
      deletedAt: new Date(),
    };

    return this.prisma.franchise.update({ where, data, select });
  }

  private async findOneById(id: string) {
    const _franchise = await this.prisma.franchise.findUnique({
      where: { id },
      select,
    });

    if (!_franchise)
      throw {
        name: `NotFoundError`,
        message: `Franchise with id ${id} not found`,
      };

    return _franchise;
  }

  private async findOneByIdWithUser(id: string) {
    const _franchise = await this.prisma.franchise.findUnique({
      where: { id },
      include: {
        user: true,
        _count: {
          select: {
            sales: true,
          },
        },
      },
    });

    if (!_franchise)
      throw {
        name: `NotFoundError`,
        message: `Franchise with id ${id} not found`,
      };

    delete _franchise?.user?.password;

    return _franchise;
  }

  private async findOneByIdWithSales(id: string) {
    const _franchise = await this.prisma.franchise.findUnique({
      where: { id },
      include: {
        sales: true,
      },
    });

    if (!_franchise)
      throw {
        name: `NotFoundError`,
        message: `Franchise with id ${id} not found`,
      };

    return _franchise;
  }

  private async getScoreByProductId(id: string) {
    const _product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        score: true,
      },
    });

    if (!_product)
      throw {
        name: `NotFoundError`,
        message: `Product with id ${id} not found`,
      };

    return _product.score;
  }
  private async getUserRoleById(id: string): Promise<Role> {
    const _user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        role: true,
      },
    });

    if (!_user)
      throw { name: `NotFoundError`, message: `User with id ${id} not found` };

    return _user.role;
  }
}
