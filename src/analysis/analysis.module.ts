import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analysis } from './entities/analysis.entity';
import { LaboratoryModule } from 'src/laboratory/laboratory.module';

@Module({
  imports: [TypeOrmModule.forFeature([Analysis]), LaboratoryModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule { }
