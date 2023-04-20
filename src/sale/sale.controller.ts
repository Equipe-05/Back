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
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { Role } from '@prisma/client';
import { isRoleCheck } from 'src/common/helpers/role-check.helper';

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
      return await this.saleService.createSale(payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }
}
