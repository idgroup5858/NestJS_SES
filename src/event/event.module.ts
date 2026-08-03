import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { EventService } from './event.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports:[UserModule],
    providers:[EventGateway, EventService],
    exports:[EventGateway]
})
export class EventModule {}
