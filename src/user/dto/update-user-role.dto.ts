import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserRoleDto extends PartialType(
  PickType(CreateUserDto, ['role']),
) {}
