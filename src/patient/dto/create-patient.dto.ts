import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePatientDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsDateString({}, { message: "Tug'ilgan kun formati noto'g'ri! Sana YYYY-MM-DD 1998-10-25 ko'rinishida bo'lishi shart." })
    birth_day: string; // Postman'dan "1998-10-25" ko'rinishida yuboriladi

    @IsNumber()
    @IsNotEmpty()
    district_id:number;

    @IsNumber()
    @IsNotEmpty()
    owner_id:number;


}
