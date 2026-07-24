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

@Module({
  imports: [UserModule,
    ConfigModule.forRoot({
      isGlobal: true, // Shu qator env-ni global qiladi
      //envFilePath: 'src/config/.my-env-file', // Fayl src/config ichida bo'lsa
    }),
    DatabaseModule,
    RoleModule,
    LaboratoryModule,
    AnalysisModule,
    RegionModule,
    PatientModule,
    OrderModule,
    PatternModule,
    ResultModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
