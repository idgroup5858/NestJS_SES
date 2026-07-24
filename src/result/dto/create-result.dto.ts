import { IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResultItemDto } from './result-item.dto';


export class CreateResultDto {
    @IsNumber()
    @IsNotEmpty()
    order_id: number; // Order obyekti o'rniga ID qabul qilamiz

    @IsNumber()
    @IsNotEmpty()
    lab_director_id: number;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateResultItemDto)
    result_item: CreateResultItemDto[];
}