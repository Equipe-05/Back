import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '@prisma/client';
import { IsNotEmpty, IsIn } from 'class-validator';

export class UpdateProductPlanDto {
  @IsNotEmpty()
  @IsIn(Object.values(Plan))
  @ApiProperty({
    description: 'Atua o plano do produto para o plano informado pelo seu ID',
    enum: Object.values(Plan),
    required: true,
  })
  plan: Plan;
}
