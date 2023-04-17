import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { isRole, isRoleCheck } from 'src/common/helpers/role-check.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class UserController {
  private readonly logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo usuário',
    description: 'Criar um novo usuário',
  })
  async createUser(
    @Body(ValidationPipe) payload: CreateUserDto,
    @GetUser() user: User,
  ) {
    try {
      isRoleCheck(user.role, Role.FRANCHISEE, Role.OPERATOR, Role.MANAGER);
      this.logger.verbose(`New user created by ${user.role} ${user.id}`);

      return await this.userService.createUserByRole(payload, user.role);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filtra usuários por nome ou email',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filtra usuários por Role',
  })
  @ApiQuery({
    name: 'deleted',
    required: false,
    description: 'Filtra usuários por status de exclusão',
  })
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Listar todos os usuários',
  })
  async getUsers(@Query(ValidationPipe) payload: GetUserFilterDto) {
    try {
      return await this.userService.getUsers(payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Listar um usuário por ID',
    description:
      'Listar um usuário por ID. O ID é passado como um parâmetro na URL.',
  })
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um usuário por ID',
    description:
      'Atualizar um usuário por ID. O ID é passado como um parâmetro na URL.',
  })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    payload: UpdateUserDto,
  ) {
    try {
      this.logger.verbose(`Updating user: id ${id}`);
      return await this.userService.updateUser(id, payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Patch(':id/role')
  @ApiOperation({
    summary: 'Atualizar a Role de um usuário por ID',
    description:
      'Atualizar a Role de um usuário por ID. O ID é passado como um parâmetro na URL.',
  })
  async updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    payload: UpdateUserRoleDto,
    @GetUser() user: User,
  ) {
    try {
      isRoleCheck(user.role, Role.OPERATOR, Role.MANAGER);
      this.logger.verbose(`Updating user role: id ${id}`);
      return await this.userService.updateUserRole(id, payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Patch(':id/password')
  @ApiOperation({
    summary: 'Atualizar a senha de um usuário por ID',
    description:
      'Atualizar a senha de um usuário por ID. O ID é passado como um parâmetro na URL.',
  })
  async updateUserPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    payload: UpdateUserPasswordDto,
  ) {
    try {
      this.logger.verbose(`Updating user Password: id ${id}`);
      return await this.userService.updateUserPassword(id, payload);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiOperation({
    summary: 'Deleta um usuário por ID',
    description:
      'Deleta um usuário por ID. O ID é passado como um parâmetro na URL.',
  })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    try {
      this.logger.verbose(`Removing user with id ${id}`);
      await this.userService.deleteUser(id);
    } catch (error) {
      exceptionsFilter(error);
    }
  }
}
