import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './order-item.dto';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(['patient', 'sample', 'course'])
    order_type: string; // 'patient', 'sample', 'course'

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    payment_method?: string;

    @IsOptional()
    @IsNumber()
    discount_percent?: number;
    
    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    village?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    district_id?: number;
    
    @IsOptional()
    @IsNumber()
    patient_id?: number;

    @IsNotEmpty()
    @IsNumber()
    owner_id: number;

   
    // IsArray va ValidateNested ichidagi elementlarni avtomatik tekshirish uchun kerak
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[]; 
}



/*


class Dto {
    street: string; // majburiy
}

const d: Dto = { }; // ❌ TS xato: Property 'street' is missing

class Dto {
    street?: string; // ixtiyoriy
}

const d: Dto = { }; // ✅ OK, street yo'q bo'lsa ham xato bermaydi

street?: string;
// aslida shunga teng: 
street: string | undefined;


*/