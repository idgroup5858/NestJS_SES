import { Module } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { LaboratoryController } from './laboratory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from './entities/laboratory.entity';
import { UserModule } from 'src/user/user.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports:[TypeOrmModule.forFeature([Laboratory]) , UserModule,CompanyModule],
  controllers: [LaboratoryController],
  providers: [LaboratoryService],
  exports:[LaboratoryService]
})
export class LaboratoryModule {}
