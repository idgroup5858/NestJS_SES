import { IsNumber } from "class-validator";

export class CreateOnlinestorageDto {

    @IsNumber()
    analysis_id:number;
}
