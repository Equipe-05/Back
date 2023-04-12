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
  plan?: Plan;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Filtra produtos por nome ou descrição',
    required: false,
  })
  search?: string;
}
