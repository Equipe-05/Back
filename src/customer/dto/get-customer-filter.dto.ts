import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetCustomerFilterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter por nome do cliente',
    required: false,
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter por endereço do cliente',
    required: false,
  })
  cnpj: string;
}
