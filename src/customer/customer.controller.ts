import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { CustomerService } from './customer.service';
import { isRoleCheck } from 'src/common/helpers/role-check.helper';
import { Role } from '@prisma/client';
import { GetCustomerFilterDto } from './dto/get-customer-filter.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
@ApiTags('customer')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo cliente',
    description: 'Criar um novo cliente para a rede de franquias',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createCustomer(
    @Body() payload: CreateCustomerDto,
    @GetUser() user: User,
  ) {
    try {
      isRoleCheck(user.role, Role.FRANCHISEE, Role.EMPLOYEE);
      return await this.customerService.createCustomer(payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  // @Put(':id')
  // async updateCustomer(
  //   @Param('id') id: string,
  //   @Body() data: Customer
  // ): Promise<Customer> {
  //   return this.prisma.customer.update({
  //     where: { id },
  //     data,
  //   });
  // }
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um cliente',
    description: 'Atualizar um cliente pelo id',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateCustomerDto,
    @GetUser() user: User,
  ) {
    try {
      isRoleCheck(user.role, Role.FRANCHISEE, Role.EMPLOYEE);
      return await this.customerService.updateCustomer(id, payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Filtro de busca de clientes',
    description: 'Filtro de busca de clientes',
  })
  async findAllCustomers(
    @Query() payload: GetCustomerFilterDto,
    @GetUser() user: User,
  ) {
    try {
      return await this.customerService.findAllCustomers(payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar um cliente',
    description: 'Buscar um cliente pelo id',
  })
  async findCustomerById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.customerService.findByIdCustomer(id);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um cliente',
    description: 'Remover um cliente pelo id',
  })
  async remove(@Param('id') id: string, @GetUser() user: User) {
    try {
      isRoleCheck(user.role, Role.FRANCHISEE, Role.EMPLOYEE);
      return await this.customerService.endCostumer(id);
    } catch (error) {
      exceptionsFilter(error);
    }
  }
}