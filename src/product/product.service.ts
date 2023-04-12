import { Injectable } from '@nestjs/common';
import { Plan, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    const { name, description, score, plan } = createProductDto;

    const data: Prisma.ProductCreateInput = {
      name,
      description,
      score,
      plan: Plan[plan],
    };

    return this.prisma.product.create({
      data,
    });
  }

  async getProducts(filterDto: GetProductsFilterDto) {
    const { plan, search } = filterDto;
    const where: Prisma.ProductWhereInput = {};

    if (plan) {
      where.plan = Plan[plan];
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
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.prisma.product.findMany({
      where,
    });
  }

  async getProductById(id: string) {
    return `This action returns a #${id} product`;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async updateProductPlan(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async deleteProduct(id: string) {
    return `This action removes a #${id} product`;
  }
}
