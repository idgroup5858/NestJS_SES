import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { District } from './entities/district.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Region,District])],
  controllers: [RegionController],
  providers: [RegionService],
  exports:[RegionService]
})
export class RegionModule {}
