import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UserModule,
    ConfigModule.forRoot({
      isGlobal: true, // Shu qator env-ni global qiladi
      //envFilePath: 'src/config/.my-env-file', // Fayl src/config ichida bo'lsa
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
