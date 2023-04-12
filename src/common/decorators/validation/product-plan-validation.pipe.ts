import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Plan } from '@prisma/client';

export class ProductPlanValidationPipe implements PipeTransform {
  readonly allowedPlans = Object.values(Plan);

  async transform(value: any) {
    value = value.toUpperCase();

    if (!this.isPlanValid(value)) {
      throw new BadRequestException(
        `Invalid plan: '${value}'. Allowed plans: ${this.allowedPlans.join(
          ', ',
        )}`,
      );
    }

    return value;
  }

  private isPlanValid(plan: any) {
    const idx = this.allowedPlans.indexOf(plan);
    return idx !== -1;
  }
}
