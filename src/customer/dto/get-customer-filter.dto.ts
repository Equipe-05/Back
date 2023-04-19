import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetCustomerFilterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filtra busca por nome ou cnpj do cliente',
    required: false,
  })
  readonly search: string;
}
