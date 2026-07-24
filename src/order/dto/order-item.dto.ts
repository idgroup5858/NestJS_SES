import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
   
    @IsNotEmpty()
    @IsNumber()
    analysis_id: number;

    @IsNotEmpty()
    @IsNumber()
    laboratory_id: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}
