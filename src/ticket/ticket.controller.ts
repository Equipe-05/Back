import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiOperation } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { isRole, isRoleCheck } from 'src/common/helpers/role-check.helper';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { Role } from '@prisma/client';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo ticket',
    description: 'Criar um novo ticket',
  })
  async createTicket(
    @Body(ValidationPipe) payload: CreateTicketDto,
    @GetUser() user: User,
  ) {
    try {
      isRole(user.role, Role.FRANCHISEE);

      return await this.ticketService.createTicket(payload, user);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateTicketDto) {
    return this.ticketService.update(+id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
