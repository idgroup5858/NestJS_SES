import { IsNumber } from "class-validator";

export class CreateUserDto {

    email:string;
    password:string;

    role_id:number;

    @IsNumber()
    company_id:number;

}
