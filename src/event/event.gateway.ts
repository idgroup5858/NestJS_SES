import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventService } from './event.service';
import { User } from 'src/user/entities/user.entity';

// cors: '*' - har qanday frontend portidan ulanishga ruxsat beradi
@WebSocketGateway(3001, { cors: { origin: '*' } })
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly eventService: EventService
  ) { }

  // Socket.io server obyekti (hamma foydalanuvchilarga xabar yuborish uchun)
  @WebSocketServer()
  server: Server;

  // Yangi foydalanuvchi ulanganda ishlaydi
  async handleConnection(client: Socket) {
    try {
      console.log(`Klient ulandi: ${client.id}`);
      const userid = client.handshake.headers["userid"];
      const user = await this.eventService.findOneUser(Number(userid));

      // Xavfsizlik: Agar foydalanuvchi bazada yo'q bo'lsa, uzib tashlaymiz
      if (!user) {
        console.log(`User topilmadi, uzilmoqda...`);
        client.disconnect();
        return;
      }
      client.emit("pong", user.username);
      // AYNAN SHU YERDA FOYDALANUVCHINI MAP (ROOM) GA QO'SHAMIZ
      // Agar userid 5 bo'lsa, u "user_5" nomli xonaga kiradi
      client.join(`user_${user.id}`);
      console.log(`User ${user.id} ("user_${user.id}" xonasiga) muvaffaqiyatli qo'shildi.`);

      client.emit("pong", user.email);
      this.server.to(`user_${userid}`).emit('pong', { text: "message nima gap" });
    } catch (error) {

    }
  }

  // Foydalanuvchi tarmoqdan uzilganda ishlaydi
  handleDisconnect(client: Socket) {
    console.log(`Klient uzildi: ${client.id}`);
  }

  // 'ping' nomli xabarni qabul qilish ping nomli eshik
  @SubscribeMessage('ping')
  async handlePing(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(`Kelgan ma'lumot: ${data} (Kimdan: ${client.id})`);

    // Xabar yuborgan foydalanuvchining o'ziga javob qaytarish
    client.emit('pong', 'Salom, xabaringiz qabul qilindi!');
    const userid = client.handshake.headers["userid"];
    const user = await this.eventService.findOneUser(Number(userid));
     if (!user) {
        console.log(`User topilmadi, uzilmoqda...`);
        client.disconnect();
        return;
      }
    client.emit("pong", user.surname);

    // Braddcast: O'zidan tashqari hamma ulanganlarga xabar yuborish
    client.broadcast.emit('global_notification', `Yangi xabar keldi: ${data}`);
  }



  // Bu funksiyani EventGateway class-ingiz ichiga qo'shib qo'ying:
  sendNotificationToAll(message: string) {
    // Serverga ulangan barcha foydalanuvchilarga xabar ketadi
    this.server.emit('global_notification', { text: message, time: new Date() });
  }

  // Agar ma'lum bir userga yubormoqchi bo'lsangiz:
  sendToSpecificUser(userId: number, message: string) {
    // Avvalroq handleConnection ichida client.join(`user_${userId}`) qilgan bo'lishingiz kerak
    this.server.to(`user_${userId}`).emit('ping', { text: message });
  }



  

}
