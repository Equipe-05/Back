import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { User } from 'src/user/entities/user.entity';
import { Prisma, TicketStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async createTicket(payload: CreateTicketDto, user: User) {
    const { description } = payload;
    const data = {
      description,
      status: TicketStatus.OPEN,
      franchiseId: 'aaa',
    };

    return await this.prisma.ticket.create({ data });
  }

  findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
