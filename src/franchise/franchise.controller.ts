import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  ParseUUIDPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import { FranchiseService } from './franchise.service';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isRole, isRoleCheck } from 'src/common/helpers/role-check.helper';
import { Role } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';
import { UpdateFranchiseUserDto } from './dto/update-franchise-user.dto';
import { GetFranchiseFilterDto } from './dto/get-franchises-filter.dto';

@Controller('franchise')
@ApiTags('franchise')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova franquia',
    description: 'Criar uma nova franquia para a rede de franquias',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() payload: CreateFranchiseDto, @GetUser() user: User) {
    try {
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);
      return await this.franchiseService.createFranchise(payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as franquias',
    description: 'Listar todas as franquias da rede de franquias',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async findAll(
    @Query() payload: GetFranchiseFilterDto,
    @GetUser() user: User,
  ) {
    try {
      if (isRole(user.role, Role.OPERATOR, Role.MANAGER)) {
        return await this.franchiseService.getAllFranchises(payload);
      }
      return await this.franchiseService.getMyFranchise(user.ownerId);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Listar uma franquia',
    description: 'Listar uma franquia da rede de franquias',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    try {
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);
      return await this.franchiseService.getFranchiseById(id);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar uma franquia',
    description: 'Atualizar uma franquia da rede de franquias',
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateFranchiseDto,
    @GetUser() user: User,
  ) {
    try {
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);
      return await this.franchiseService.updateFranchise(id, payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Patch(':id/user')
  @ApiOperation({
    summary: 'Vincula um usuário a uma franquia',
    description:
      'Vincula um usuário a uma franquia da rede de franquias, o usuário deve ser um franqueado',
  })
  @ApiBody({ type: UpdateFranchiseUserDto })
  async updateFranchiseUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('userId', ParseUUIDPipe) payload: string,
    @GetUser() user: User,
  ) {
    try {
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);
      return await this.franchiseService.setFranchiseOwner(id, payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover uma franquia',
    description: 'Remover uma franquia da rede de franquias',
  })
  async remove(@Param('id') id: string, @GetUser() user: User) {
    try {
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);
      return await this.franchiseService.endFranchise(id);
    } catch (error) {
      exceptionsFilter(error);
    }
  }
}
