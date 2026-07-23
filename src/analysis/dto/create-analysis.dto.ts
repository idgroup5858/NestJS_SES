import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAnalysisDto {

    @IsNumber()
    @IsNotEmpty({message:"Laboratory id bolishi shart"})
    laboratory_id:number;

    @IsString()
    name:string;
}
