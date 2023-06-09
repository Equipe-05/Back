import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '@prisma/client';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetProductsFilterDto {
  @IsOptional()
  @IsIn(Object.values(Plan))
  @ApiProperty({
    description: 'O plano do produto',
    enum: Object.values(Plan),
    required: false,
  })
  readonly plan?: Plan;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Filtra produtos por nome ou descrição',
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
