import { IsIn } from "class-validator";

export class CreateRoleDto {

    @IsIn(['admin', 'kassir', 'lab_asistant', 'lab_director',"director"])
    name:string;
}
