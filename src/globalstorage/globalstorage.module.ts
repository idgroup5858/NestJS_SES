import { Module } from '@nestjs/common';
import { GlobalstorageService } from './globalstorage.service';
import { GlobalstorageController } from './globalstorage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Globalstorage } from './entities/globalstorage.entity';
import { AnalysisModule } from 'src/analysis/analysis.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports:[TypeOrmModule.forFeature([Globalstorage]),AnalysisModule, CompanyModule],
  controllers: [GlobalstorageController],
  providers: [GlobalstorageService],
})
export class GlobalstorageModule {}
