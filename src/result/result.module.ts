import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { ResultItem } from './entities/result_item.entity';
import { CompanyModule } from 'src/company/company.module';
import { LaboratoryModule } from 'src/laboratory/laboratory.module';
import { AnalysisModule } from 'src/analysis/analysis.module';

@Module({
  imports:[TypeOrmModule.forFeature([Result,ResultItem]),CompanyModule,LaboratoryModule,AnalysisModule],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule {}
