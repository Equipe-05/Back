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
  findOneById(id: string) {
    throw new Error('Method not implemented.');
  }

  async update(id: string, updateFranchiseDto: UpdateFranchiseDto) {
    const { name, address, cnpj, phone, score } = updateFranchiseDto;
    const data: Prisma.FranchiseUpdateInput = {
      name,
      address,
      cnpj,
      phone,
      score,
    };
    return await this.prisma.franchise.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} franchise`;
  }
}
