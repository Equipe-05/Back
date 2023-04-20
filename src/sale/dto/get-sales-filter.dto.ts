import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetSalesFilterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filtra busca pela descrição da venda',
    required: false,
  })
  readonly search: string;
}
