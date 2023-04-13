import { Injectable } from '@nestjs/common';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FranchiseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFranchiseDto: CreateFranchiseDto) {
    const { name, address, cnpj, phone } = createFranchiseDto;
    const data: Prisma.FranchiseCreateInput = {
      name,
      address,
      cnpj,
      phone,
    };

    return await this.prisma.franchise.create({ data });
  }

  async findAll() {
    return this.prisma.franchise.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        cnpj: true,
        phone: true,
        score: true,
      },
    });
  }

  async findOne(id: string) {
    const franchise = await this.findOneById(id);
    return franchise;
  }

  update(id: string, updateFranchiseDto: UpdateFranchiseDto) {
    return `This action updates a #${id} franchise`;
  }

  remove(id: string) {
    return `This action removes a #${id} franchise`;
  }

  private async findOneById(id: string) {
    const franchise = await this.prisma.franchise.findUnique({
      where: { id },
    });

    if (!franchise)
      throw {
        name: 'NotFoundError',
        message: `Franchise with id ${id} not found`,
      };

    return franchise;
  }
}
