import { PartialType, PickType } from '@nestjs/swagger';
import { CreateSaleDto } from './create-sale.dto';

export class UpdateSaleDto extends PartialType(
  PickType(CreateSaleDto, ['description'] as const),
) {}
