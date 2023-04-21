import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { Role } from '@prisma/client';
import {
  isNotRoleCheck,
  isRoleCheck,
} from 'src/common/helpers/role-check.helper';
import { GetSalesFilterDto } from './dto/get-sales-filter.dto';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiTags('sale')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova venda',
    description: 'Criar uma nova venda para um franqueado',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createSale(@Body() payload: CreateSaleDto, @GetUser() user: User) {
    try {
      isRoleCheck(user.role, Role.EMPLOYEE, Role.FRANCHISEE);
      return await this.saleService.createSale(payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filtra busca pela descrição da venda',
  })
  @ApiOperation({
    summary: 'Listar todas as vendas',
    description: 'Listar todas as vendas de toda a rede de franquias',
  })
  async getAllSales(
    @Query(ValidationPipe) filter: GetSalesFilterDto,
    @GetUser() user: User,
  ) {
    try {
      isNotRoleCheck(user.role, Role.EMPLOYEE);
      return await this.saleService.getAllSales(filter, user);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Listar uma venda específica através do seu ID',
    description:
      'Listar uma venda específica através do seu ID. ID da venda é gerado automaticamente pelo sistema',
  })
  async getSaleById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    try {
      return await this.saleService.getSaleById(id, user);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get('/franchise/:franchiseId')
  @ApiOperation({
    summary: 'Listar todas as vendas de um franqueado',
    description: 'Listar todas as vendas de um franqueado',
  })
  async getSalesByFranchise(
    @Param('franchiseId', ParseUUIDPipe) franchiseId: string,
    @GetUser() user: User,
  ) {
    try {
      return await this.saleService.getSalesByFranchise(franchiseId, user);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get('/customer/:customerId')
  @ApiOperation({
    summary: 'Listar todas as vendas de um cliente',
    description: 'Listar todas as vendas de um cliente específico',
  })
  async getSalesByCustomer(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @GetUser() user: User,
  ) {
    try {
      return await this.saleService.getSalesByCustomer(customerId, user);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get('/user/:userId')
  @ApiOperation({
    summary: 'Listar todas as vendas de um usuário',
    description: 'Listar todas as vendas de um usuário específico',
  })
  async getSalesByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @GetUser() user: User,
  ) {
    try {
      return await this.saleService.getSalesByUser(userId, user);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get('/product/:productId')
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filtrar busca por uma descrição específica de venda',
  })
  @ApiOperation({
    summary:
      'Listar todas as vendas de um produto. Operação exclusiva para operadores e gerentes',
    description:
      'Listar todas as vendas de um produto específico. Operação exclusiva para operadores e gerentes. O ID do produto é gerado automaticamente pelo sistema',
  })
  async getSalesByProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query(ValidationPipe) filter: GetSalesFilterDto,
    @GetUser() user: User,
  ) {
    try {
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);
      return await this.saleService.getSalesByProduct(productId, filter);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar uma venda específica através do seu ID',
    description:
      'Atualizar uma venda específica através do seu ID. ID da venda é gerado automaticamente pelo sistema',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateSale(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateSaleDto,
    @GetUser() user: User,
  ) {
    try {
      isNotRoleCheck(user.role, Role.EMPLOYEE);
      return await this.saleService.updateSale(id, payload, user);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar uma venda específica através do seu ID',
    description:
      'Deletar uma venda específica através do seu ID. ID da venda é gerado automaticamente pelo sistema',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSale(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    try {
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);
      await this.saleService.deleteSale(id);
    } catch (error) {
      exceptionsFilter(error);
    }
  }
}
