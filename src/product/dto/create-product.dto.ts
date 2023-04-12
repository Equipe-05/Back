import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '@prisma/client';
import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    description: 'O nome do produto',
    example: 'E-COMMERCE',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  @ApiProperty({
    description: 'A descrição do produto',
    example: 'Descrição da E-COMMERCE',
  })
  description: string;

  @IsNotEmpty()
  @IsIn([
    Plan.AVEC,
    Plan.AVECGO,
    Plan.CROSSX,
    Plan.PAYMENTS,
    Plan.PLATAFORMA_HYPERLOCAL,
    Plan.SALAOVIP,
  ])
  @ApiProperty({
    description: 'O plano do produto',
    enum: [
      Plan.AVEC,
      Plan.AVECGO,
      Plan.CROSSX,
      Plan.PAYMENTS,
      Plan.PLATAFORMA_HYPERLOCAL,
      Plan.SALAOVIP,
    ],
    required: true,
  })
  plan: Plan;
}
