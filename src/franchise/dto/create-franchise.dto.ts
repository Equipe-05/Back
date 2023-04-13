import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFranchiseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    description: 'O nome da franquia',
    example: 'Franquia do João da Silva S/A',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(250)
  @ApiProperty({
    description: 'O endereço da franquia',
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
    description:
      'Telefone usuário (Exemplos: +55 (11) 98888-8888 / 9888-8888 / 11 98888-8888 / 5511988888888)',
    example: '11 98888-8888',
  })
  readonly phone: string;

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
}
