import { Module } from '@nestjs/common';
import { PatternService } from './pattern.service';
import { PatternController } from './pattern.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pattern } from './entities/pattern.entity';
import { AnalysisModule } from 'src/analysis/analysis.module';

@Module({
  imports:[TypeOrmModule.forFeature([Pattern]),AnalysisModule],
  controllers: [PatternController],
  providers: [PatternService],
})
export class PatternModule {}
