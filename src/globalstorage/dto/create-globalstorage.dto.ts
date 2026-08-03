import { IsNumber } from "class-validator";

export class CreateGlobalstorageDto {
        @IsNumber()
        analysis_id: number;

        @IsNumber()
        company_id:number;
}
