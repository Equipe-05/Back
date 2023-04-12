import { Injectable } from '@nestjs/common';
import { Plan, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { UpdateProductPlanDto } from './dto/update-product-plan.dto';

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
    const product = await this.findOneById(id);
    const { name, description, score } = updateProductDto;

    const data: Prisma.ProductUpdateInput = {
      name: name ?? product.name,
      description: description ?? product.description,
      score: score ?? product.score,
    };

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async updateProductPlan(id: string, plan: Plan) {
    await this.findOneById(id);
    const data: Prisma.ProductUpdateInput = {
      plan,
    };

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string) {
    await this.findOneById(id);
    await this.prisma.product.delete({
      where: { id },
    });
  }

  private async findOneById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product)
      throw {
        name: 'NotFoundError',
        message: `Product with id ${id} not found`,
      };

    return product;
  }
}
