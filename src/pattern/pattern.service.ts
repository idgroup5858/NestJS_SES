import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { Pattern } from './entities/pattern.entity';
import { AnalysisService } from 'src/analysis/analysis.service';
import { UpdatePatternDto } from './dto/update-pattern.dto';


@Injectable()
export class PatternService {
  constructor(
    @InjectRepository(Pattern)
    private readonly patternRepository: Repository<Pattern>,

    private analysisServie: AnalysisService
  ) { }

  // 1. Pattern yaratish (Relation ob'ekt bilan)
  async create(createPatternDto: CreatePatternDto) {

    const analysis = await this.analysisServie.findOne(createPatternDto.analysis_id)


    // Relation ob'ekt ko'rinishida yuboriladi
    const pattern = this.patternRepository.create({
      ...createPatternDto,
      analysis: analysis // TypeORM buni tushunib, analysis_id ustuniga yozadi
    });

    return await this.patternRepository.save(pattern);
  }

  // 2. Barcha Pattern'larni ob'ekti bilan birga yuklash
  async findAll() {
    return await this.patternRepository.find({
      relations: {
        analysis: true // TRUE orqali to'liq Analysis ob'ektini bazadan olib chiqadi
      }
    });
  }

  // 3. ID bo'yicha olish (Ob'ekti bilan birga)
  async findOne(id: number): Promise<Pattern> {
    const pattern = await this.patternRepository.findOne({
      where: { id },
      relations: {
        analysis: true // TRUE orqali bog'langan ob'ektni qo'shib yuklaydi
      }
    });

    if (!pattern) {
      throw new NotFoundException(`IDsi ${id} bo'lgan pattern topilmadi.`);
    }
    return pattern;
  }

  // 4. Pattern'ni yangilash (Relation ob'ekt bilan)
 async update(id: number, updatePatternDto: UpdatePatternDto) {
    
    await this.findOne(id); 
    
    const { analysis_id, ...patternData } = updatePatternDto;

   
    const pattern = await this.patternRepository.preload({
        id: id,
        ...patternData,
    });

    if (!pattern) {
        throw new NotFoundException(`IDsi ${id} bo'lgan Pattern topilmadi.`);
    }

    if (analysis_id!=undefined && analysis_id!=null) {
        const analysis = await this.analysisServie.findOne(analysis_id);       
        pattern.analysis = analysis ; 
    }

    // 5. Bazaga saqlaymiz
    return await this.patternRepository.save(pattern);
}


  // 5. Pattern'ni o'chirish
  async remove(id: number): Promise<void> {
    const pattern = await this.findOne(id);
    await this.patternRepository.remove(pattern);
  }
}
