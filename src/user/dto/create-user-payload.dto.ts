import { CreateUserDto } from './create-user.dto';

export class CreateUserPayload extends CreateUserDto {
  ownerId?: string;
}
