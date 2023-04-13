import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, Max, Min } from 'class-validator';

export class GetFranchiseFilterDto {
  @IsOptional()
  @Min(0)
  @Max(999)
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    description:
      'Filter por score da franquia. Maiores ou iguais ao valor informado',
    required: false,
  })
  readonly minscore?: number;

  @IsOptional()
  @Min(0)
  @Max(999)
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    description:
      'Filter por score da franquia. Menores ou iguais ao valor informado',
    required: false,
  })
  readonly maxscore?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Filtra franquias por nome, endereço ou cnpj',
    required: false,
  })
  readonly search?: string;

  @IsOptional()
  @IsIn(['TRUE', 'FALSE'])
  @ApiProperty({
    description: 'Filtrar por produtos deletados ou não deletados',
    enum: ['TRUE', 'FALSE'],
    required: false,
  })
  readonly deleted?: string;
}
