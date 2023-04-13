import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateFranchiseUserDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'O ID do usuário proprietário da franquia',
    example: '6016b644-8a68-4421-b589-af4974b2c9e0',
  })
  readonly userId: string;
}
