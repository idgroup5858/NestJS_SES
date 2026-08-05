import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventService } from './event.service';

// cors: '*' - har qanday frontend portidan ulanishga ruxsat beradi
@WebSocketGateway(3001, { cors: { origin: '*' } })
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly eventService: EventService) {}

  // Socket.io server obyekti (hamma foydalanuvchilarga xabar yuborish uchun)
  @WebSocketServer()
  server: Server;

  // Yangi foydalanuvchi ulanganda ishlaydi
  async handleConnection(client: Socket) {
    try {
      console.log(`Klient ulandi: ${client.id}`);
      const companyid = client.handshake.headers['companyid'];

      if (!companyid) {
        console.log(`Company id topilmadi, uzilmoqda...`);
        client.disconnect();
        return;
      }
      await client.join(`company_${companyid}`);
      setTimeout(() => {
        client.emit('company', companyid);
        client.emit('company', 'qoshildi axir');

        this.server.to(`company_${companyid}`).emit('company', {
          text: 'message nima gap',
        });
      }, 100);
    } catch (error) {}
  }

  // Foydalanuvchi tarmoqdan uzilganda ishlaydi
  handleDisconnect(client: Socket) {
    console.log(`Klient uzildi: ${client.id}`);
  }

  // 'ping' nomli xabarni qabul qilish ping nomli eshik
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          console.error('Data JSON formatda emas:', data);
          return;
        }
      }

      const fromCompanyId = client.handshake.headers['companyid'];
      const targetRoom = `company_${data.toCompanyId}`;

      // Maqsadli kompaniya online-yo'qligini tekshiramiz
      const sockets = await this.server.in(targetRoom).fetchSockets();

      if (sockets.length === 0) {
        console.log(
          `Company ${data.toCompanyId} hozir offline, xabar yetib bormaydi`,
        );
        // Kerak bo'lsa, jo'natuvchiga xabar berish mumkin:
        client.emit('company', `${targetRoom} hozir offline`);
        client.emit('company_offline', { toCompanyId: data.toCompanyId });
        return;
      }

      console.log(
        `Company ${fromCompanyId} dan Company ${data.toCompanyId} ga xabar: ${data.message}`,
      );

      this.server.to(targetRoom).emit('company', {
        from: fromCompanyId,
        text: data.message,
      });
    } catch (error) {
      console.error('Xabar yuborishda xatolik:', error);
    }
  }

  // Bu funksiyani EventGateway class-ingiz ichiga qo'shib qo'ying:
  sendNotificationToAll(message: string) {
    // Serverga ulangan barcha foydalanuvchilarga xabar ketadi
    this.server.emit('company', {
      text: message,
      time: new Date(),
    });
  }

  // Agar ma'lum bir userga yubormoqchi bo'lsangiz:
  async sendToSpecificCompany(companyid: number,phone:string|null, message: string) {
    // Avvalroq handleConnection ichida client.join(`user_${userId}`) qilgan bo'lishingiz kerak
    const sockets = await this.server.in(`company_${companyid}`).fetchSockets();
    if (sockets.length === 0) {
        console.log(`Company ${companyid} hozir offline, xabar yetib bormaydi`);
        // Kerak bo'lsa, jo'natuvchiga xabar berish mumkin:
        return;
      }
    this.server.to(`company_${companyid}`).emit('company', { text: message ,phone});
  }
}
