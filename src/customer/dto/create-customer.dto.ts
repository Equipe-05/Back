import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, {
    message: 'CNPJ inválido (Exemplo: 11.111.111/1111-11)',
  })
  @ApiProperty({
    description: 'O CNPJ da franquia',
    example: '11.111.111/1111-11',
  })
  readonly cnpj: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(250)
  @ApiProperty({
    description: 'O endereço do cliente',
    example: 'Rua dos Bobos, 0',
  })
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/,
    {
      message:
        'Telefone inválido (Exemplos: +55 (11) 98888-8888 / 9888-8888 / 11 98888-8888 / 5511988888888)',
    },
  )
  @ApiProperty({
    description: 'Telefone do cliente',
    example: '11 98888-8888',
  })
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    description: 'o Id da franquia',
    example: 'f88c5ef9-badb-4523-af6e-dbea69aadb3c',
  })
  readonly franchiseId: string;
}
