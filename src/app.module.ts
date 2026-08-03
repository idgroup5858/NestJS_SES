import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RoleModule } from './role/role.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { AnalysisModule } from './analysis/analysis.module';
import { RegionModule } from './region/region.module';
import { PatientModule } from './patient/patient.module';
import { OrderModule } from './order/order.module';
import { PatternModule } from './pattern/pattern.module';
import { ResultModule } from './result/result.module';
import { ClsModule } from 'nestjs-cls';
import { CompanyModule } from './company/company.module';
import { OnlinestorageModule } from './onlinestorage/onlinestorage.module';
import { EventModule } from './event/event.module';
import { GlobalstorageModule } from './globalstorage/globalstorage.module';

@Module({
  imports: [UserModule,
    ConfigModule.forRoot({
      isGlobal: true, // Shu qator env-ni global qiladi
      //envFilePath: 'src/config/.my-env-file', // Fayl src/config ichida bo'lsa
    }),
     ClsModule.forRoot({
      global: true,
      middleware: { mount: true }, // Request boshlanganda bo'sh xotira konteynerini ochib beradi
    }),
    DatabaseModule,
    RoleModule,
    LaboratoryModule,
    AnalysisModule,
    RegionModule,
    PatientModule,
    OrderModule,
    PatternModule,
    ResultModule,
    CompanyModule,
    OnlinestorageModule,
    EventModule,
    GlobalstorageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
