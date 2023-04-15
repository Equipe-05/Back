import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  readonly name: string;
  readonly cnpj: string;
  readonly address: string;
  readonly phone: string;
  readonly franchise: string;
  readonly franchiseId: string;
  readonly sales: string;
  readonly products: string;
}
