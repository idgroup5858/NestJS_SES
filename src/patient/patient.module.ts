import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { RegionModule } from 'src/region/region.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), RegionModule,UserModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports:[PatientService]
})
export class PatientModule { }
