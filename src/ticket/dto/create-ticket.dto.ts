import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'A descrição do ticket',
    example: 'Este é um ticket de teste',
  })
  readonly description: string;
}
