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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users',
  })
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by ID',
    description:
      'Get a user by ID. The ID is passed as a parameter in the URL.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.userService.findOne(id);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user by ID',
    description:
      'Update a user by ID. The ID is passed as a parameter in the URL.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true }))
    updateUserDto: UpdateUserDto,
  ) {
    try {
      this.logger.debug(`Updating user with id ${id}`);
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a user by ID',
    description:
      'Delete a user by ID. The ID is passed as a parameter in the URL.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      this.logger.debug(`Removing user with id ${id}`);
      await this.userService.remove(id);
    } catch (error) {
      exceptionsFilter(error);
    }
  }
}
