import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, {
    message: 'Email must be a valid email',
  })
  @ApiProperty({
    description: 'The email of the user',
    example: 'my@email.com',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(EMPLOYEE|FRANCHISEE|OPERATOR|MANAGER)$/, {
    message:
      'Role must be a valid role. Valid roles: EMPLOYEE, FRANCHISEE, OPERATOR, MANAGER',
  })
  @ApiProperty({
    description: 'The role of the user',
    example: 'FRANCHISEE',
  })
  readonly role: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  @ApiProperty({
    description:
      'The password of the user. Must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character',
    example: 'Abc@@123',
  })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'confirmPassword must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  @ApiProperty({
    description: 'Confirm the user password for validation.',
    example: 'Abc@@123',
  })
  readonly confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  @ApiProperty({
    description: 'The CPF of the user',
    example: '12345678901',
  })
  readonly cpf: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @ApiProperty({
    description: 'The address of the user',
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
}
