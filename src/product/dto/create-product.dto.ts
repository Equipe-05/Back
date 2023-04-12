import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '@prisma/client';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
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
    example: Plan.PLATAFORMA_HYPERLOCAL,
    required: true,
  })
  plan: Plan;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(30)
  @ApiProperty({
    description: 'O score do produto (1 a 30)',
    example: 4,
  })
  score: number;
}
