import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_item.entity';
import { RegionModule } from 'src/region/region.module';
import { PatientModule } from 'src/patient/patient.module';
import { UserModule } from 'src/user/user.module';
import { AnalysisModule } from 'src/analysis/analysis.module';
import { LaboratoryModule } from 'src/laboratory/laboratory.module';

@Module({
  imports:[TypeOrmModule.forFeature([Order,OrderItem]), PatientModule, RegionModule, UserModule,AnalysisModule,LaboratoryModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
