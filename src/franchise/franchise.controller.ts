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
} from '@nestjs/common';
import { FranchiseService } from './franchise.service';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isRole } from 'src/common/helpers/role-check.helper';
import { Role } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';

@Controller('franchisee')
@ApiTags('franchisee')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova franquia',
    description: 'Criar uma nova franquia para a rede de franquias',
  })
  async create(
    @Body(ValidationPipe) createFranchiseDto: CreateFranchiseDto,
    @GetUser() user: User,
  ) {
    try {
      isRole(user.role, Role.OPERATOR, Role.MANAGER);
      return await this.franchiseService.create(createFranchiseDto);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get()
  findAll() {
    return this.franchiseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.franchiseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFranchiseDto: UpdateFranchiseDto,
  ) {
    return this.franchiseService.update(id, updateFranchiseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.franchiseService.remove(id);
  }
}
