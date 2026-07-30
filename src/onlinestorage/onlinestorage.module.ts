import { Module } from '@nestjs/common';
import { OnlinestorageService } from './onlinestorage.service';
import { OnlinestorageController } from './onlinestorage.controller';
import { AnalysisModule } from 'src/analysis/analysis.module';
import { CompanyModule } from 'src/company/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Onlinestorage } from './entities/onlinestorage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Onlinestorage]), AnalysisModule, CompanyModule],
  controllers: [OnlinestorageController],
  providers: [OnlinestorageService],
})
export class OnlinestorageModule { }
