import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity'; 
import { District } from './entities/district.entity';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>, // Ma'lumotlar bazasiga ulanish
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  

  // 2. Barcha hududlarni olish
  async findAll() {
    return await this.regionRepository.find({
      order: { id: 'ASC' }, // Hududlarni ID tartibi bo'yicha tartiblaymiz
      relations:{
        district:true
      }
    });
  }

  // 2. Barcha hududlarni olish
  async findAllDistrict() {
    return await this.districtRepository.find({
      order: { id: 'ASC' }, // District ID tartibi bo'yicha tartiblaymiz
      relations:{
        region:true
      }
    });
  }

  // 3. ID bo'yicha bitta hududni topish
  async findOne(id: number) {
    const region = await this.regionRepository.findOne({
      where:{ id},
      relations:{
        district:true
      } 
      });
    if (!region) {
      throw new NotFoundException(`ID: ${id} bo'lgan hudud topilmadi!`);
    }
    return region;
  }

  async findOneDistrict(id: number) {
    const district = await this.districtRepository.findOne({
      where:{ id},
      relations:{
        region:true
      } 
      });
    if (!district) {
      throw new NotFoundException(`ID: ${id} bo'lgan tuman shahar topilmadi!`);
    }
    return district;
  }

  
}
