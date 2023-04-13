import { Injectable } from '@nestjs/common';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { isRoleCheck } from 'src/common/helpers/role-check.helper';

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
  createdAt: true,
  deletedAt: true,
};

@Injectable()
export class FranchiseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateFranchiseDto) {
    const { name, address, cnpj, phone } = payload;
    const data: Prisma.FranchiseCreateInput = {
      name,
      address,
      cnpj,
      phone,
    };

    return await this.prisma.franchise.create({ data, select });
  }

  async getAllFranchises() {
    return this.prisma.franchise.findMany({
      select,
      orderBy: [{ deletedAt: 'desc' }, { name: 'asc' }],
    });
  }

  async getMyFranchise(id: string) {
    const where: Prisma.FranchiseWhereInput = { userId: id };
    return this.prisma.franchise.findMany({ where, select });
  }

  async findOne(id: string) {
    const franchise = await this.findOneByIdWithUser(id);
    return franchise;
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

  private async getUserRoleById(id: string): Promise<Role> {
    console.log('id', id);
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
