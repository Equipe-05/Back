import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { isRole } from 'src/common/helpers/role-check.helper';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo Produto para a rede de franquias',
    description:
      'Criar um novo Produto que será disponibilizado para os franqueados da rede',
  })
  async createProduct(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    try {
      isRole(user.role, Role.OPERATOR, Role.MANAGER);

      return await this.productService.createProduct(createProductDto);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filtra produtos por nome ou descrição',
  })
  @ApiQuery({
    name: 'plan',
    required: false,
    description: 'Filtra produtos por plano',
  })
  @ApiOperation({
    summary: 'Listar todos os Produtos da rede de franquias',
    description:
      'Listar todos os Produtos que estão disponíveis para os franqueados da rede',
  })
  async getProducts(
    @Query(ValidationPipe) filterDto: GetProductsFilterDto,
    @GetUser() user: User,
  ) {
    try {
      isRole(user.role, Role.OPERATOR, Role.MANAGER);

      return await this.productService.getProducts(filterDto);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get(':id')
  async getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productService.getProductById(id);
  }

  @Patch(':id')
  async updateProductPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.updateProductPlan(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productService.deleteProduct(id);
  }
}
