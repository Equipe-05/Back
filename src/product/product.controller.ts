import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Plan, Role, User } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ProductPlanValidationPipe } from 'src/common/decorators/validation/product-plan-validation.pipe';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { isRoleCheck } from 'src/common/helpers/role-check.helper';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { UpdateProductPlanDto } from './dto/update-product-plan.dto';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';

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
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);

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
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);

      return await this.productService.getProducts(filterDto);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar um Produto específico pelo seu ID',
    description:
      'Buscar um Produto específico pelo seu ID. O ID do Produto é gerado automaticamente pelo sistema',
  })
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    try {
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);

      return await this.productService.getProductById(id);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Patch(':id/plan')
  @ApiOperation({
    summary: 'Atualizar o plano de um Produto específico pelo seu ID',
    description:
      'Atualizar o plano de um Produto específico pelo seu ID. O ID do Produto é gerado automaticamente pelo sistema',
  })
  @ApiBody({
    type: UpdateProductPlanDto,
    enum: Object.values(Plan),
    required: true,
  })
  async updateProductPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('plan', ProductPlanValidationPipe) plan: Plan,
  ) {
    try {
      return await this.productService.updateProductPlan(id, plan);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um Produto específico pelo seu ID',
    description:
      'Atualizar um Produto específico pelo seu ID. O ID do Produto é gerado automaticamente pelo sistema',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      return await this.productService.updateProduct(id, updateProductDto);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar um Produto específico pelo seu ID',
    description:
      'Deletar um Produto específico pelo seu ID. O ID do Produto é gerado automaticamente pelo sistema',
  })
  @ApiResponse({
    status: 204,
    description: 'Produto deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    try {
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);
      await this.productService.deleteProduct(id);
    } catch (error) {
      exceptionsFilter(error);
    }
  }
}
