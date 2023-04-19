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
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Customer } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('customer')
@ApiTags('customer')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class CustomerController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo cliente',
    description: 'Criar um novo cliente para a rede de franquias',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createCustomer(@Body() data: Customer): Promise<Customer> {
    return this.prisma.customer.create({
      data,
    });
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() data: Customer,
  ): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  @Get()
  async findAllCustomers(): Promise<Customer[]> {
    return this.prisma.customer.findMany();
  }

  @Get(':id')
  async findCustomerById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Customer> {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  @Delete(':id')
  async deleteCustomer(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Customer> {
    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
