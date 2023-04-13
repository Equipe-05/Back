import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class GetUserFilterDto {
  @IsOptional()
  @IsIn(Object.values(Role))
  @ApiProperty({
    description: 'A Role do usuário',
    enum: Object.values(Role),
    required: false,
  })
  readonly role?: Role;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Filtra usuários por nome ou email',
    required: false,
  })
  readonly search?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(['TRUE', 'FALSE'])
  @ApiProperty({
    description: 'Filtrar por produtos deletados ou não deletados',
    enum: ['TRUE', 'FALSE'],
    required: false,
  })
  readonly deleted?: string;
}
