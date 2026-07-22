import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // 1. Import qilish shart

@Injectable()
export class AppService {
  // 2. Konstruktorda xizmatni chaqirib olamiz
  constructor(private configService: ConfigService) {}

  getHello(): string {
    // 3. .env ichidagi o'zgaruvchini nomini yozib olamiz
    const dbHost = this.configService.get<string>('PR');
    
    console.log(dbHost); // .env dagi qiymatni konsolga chiqaradi
    
    return 'Hello World!';
  }
}
