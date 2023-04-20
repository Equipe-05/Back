import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Descrição da venda',
    example: 'E-COMMERCE - 1 ano - para 10 usuários',
    required: false,
  })
  readonly description?: string;

  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Id do cliente que comprou o produto',
    example: 'd4e56668-8cb9-44a7-abe2-ed054dcf3352',
    required: true,
  })
  readonly customerId: string;

  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Id da franquia que realizou a venda',
    example: 'f88c5ef9-badb-4523-af6e-dbea69aadb3c',
    required: true,
  })
  readonly franchiseId: string;

  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Id do produto que foi vendido',
    example: '84fd6a07-1d08-4523-87de-6b4bf14a92d5',
    required: true,
  })
  readonly productId: string;

  @IsString()
  @IsUUID()
  @ApiProperty({
    description:
      'Id do usuário que realizou a venda. Franqueado ou colaborador',
    example: 'b2234007-f0c9-4f9d-a2cd-6d82d4040756',
    required: true,
  })
  readonly userId: string;
}
