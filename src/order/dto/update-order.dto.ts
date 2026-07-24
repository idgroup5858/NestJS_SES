import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
// update-order-status.dto.ts
export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsIn(['pending', 'partially_completed', 'completed', 'canceled'])
  status: string;
}

// update-payment-status.dto.ts
export class UpdatePaymentStatusDto {
  @IsNotEmpty()
  @IsIn(['pending', 'paid', 'refunded'])
  status: string;
}

// update-order-item-status.dto.ts
export class UpdateOrderItemStatusDto {
  @IsNotEmpty()
  @IsIn(['pending', 'in_progress', 'completed'])
  status: string;
}