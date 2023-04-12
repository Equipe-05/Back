import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { isRole } from 'src/common/helpers/role-check.helper';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

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
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    try {
      isRole(user.role, Role.OPERATOR, Role.MANAGER);

      return await this.productService.create(createProductDto);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productService.remove(id);
  }
}
