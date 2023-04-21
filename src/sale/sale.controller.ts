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
import { isRoleCheck } from 'src/common/helpers/role-check.helper';
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
  async getAllSales(@Query(ValidationPipe) filter: GetSalesFilterDto) {
    try {
      return await this.saleService.getAllSales(filter);
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
}
