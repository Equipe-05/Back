import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserPasswordDto extends PartialType(
  PickType(CreateUserDto, ['password', 'confirmPassword']),
) {
  @IsNotEmpty()
  @ApiProperty({
    description: 'A senha atual do usuário',
    example: 'Abc@@123',
  })
  readonly currentPassword: string;
}
