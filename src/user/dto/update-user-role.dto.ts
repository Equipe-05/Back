import { ApiProperty } from '@nestjs/swagger';
import { Plan, Role } from '@prisma/client';
import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(Role), {
    message: `Role must be a valid role. Valid roles: ${Object.values(
      Role,
    ).join(', ')}`,
  })
  @ApiProperty({
    description: 'A Role do usuário',
    enum: Object.values(Role),
    example: Role.EMPLOYEE,
  })
  readonly role: string;
}
