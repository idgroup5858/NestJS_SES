import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EventService {

    constructor(
        private readonly userService:UserService
    ){}


    async findOneUser(id:number){
        const user = await this.userService.findOneForSocket(id);
        return user;
    }
}
