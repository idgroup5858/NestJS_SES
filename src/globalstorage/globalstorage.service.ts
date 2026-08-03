import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Globalstorage } from './entities/globalstorage.entity'; // Entity manzili o'zgartirildi
import { CreateGlobalstorageDto } from './dto/create-globalstorage.dto'; // DTO manzili o'zgartirildi
import { UpdateGlobalstorageDto } from './dto/update-globalstorage.dto'; // DTO manzili o'zgartirildi
import { AnalysisService } from 'src/analysis/analysis.service';
import { ClsService } from 'nestjs-cls';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class GlobalstorageService {
  constructor(
    @InjectRepository(Globalstorage)
    private readonly globalstorageRepository: Repository<Globalstorage>,

    private analysisServie: AnalysisService,
    private readonly cls: ClsService,
    private companyService: CompanyService,
  ) { }

  // 1. Globalstorage yaratish (Relation ob'ekt bilan)
  async create(createGlobalstorageDto: CreateGlobalstorageDto) {
   

    const { analysis_id,company_id, ...rest } = createGlobalstorageDto

    const globalstorage = this.globalstorageRepository.create({
      ...rest
    });

    if (analysis_id) {
      const analysis = await this.analysisServie.findOneWithOutToken(createGlobalstorageDto.analysis_id)
      if (!analysis) throw new NotFoundException("Analysis not found");
      globalstorage.analysis = analysis
    }
    if (company_id) {
      const company = await this.companyService.findOne(company_id)
      if (!company) throw new NotFoundException("Company not found");
      globalstorage.company = company;
    }

    return await this.globalstorageRepository.save(globalstorage);
  }

  // 2. Barcha Globalstorage'larni ob'ekti bilan birga yuklash
  async findAll() {
    
    return await this.globalstorageRepository.find({
      
      relations: {
        analysis: true
      },
    });
  }

  async findAllPagSearch(
    page: number,
    limit: number,
    search?: string
  ) {
    

    // Sahifalash (Pagination) default qiymatlarini sozlash
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const skip = (page - 1) * limit;

    // QueryBuilder yaratamiz va bog'langan munosabatlarni yuklaymiz
    const query = this.globalstorageRepository.createQueryBuilder('globalstorage')
      .leftJoinAndSelect('globalstorage.analysis', 'analysis')       


    // Qidiruv — fayl nomi yoki tavsifi bo'yicha
    if (search) {
      query.andWhere(
        '(globalstorage.name ILIKE :search OR globalstorage.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Ma'lumotlarni olish va umumiy sonini hisoblash
    const [data, total] = await query
      .orderBy('globalstorage.createdAt', 'DESC') // Yangi qo'shilganlar birinchi chiqadi
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Standart pagination formati
    return {
      meta: {
        total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  }

  // 3. ID bo'yicha olish (Ob'ekti bilan birga)
  async findOne(id: number): Promise<Globalstorage> {
    
    const globalstorage = await this.globalstorageRepository.findOne({
      where: { id},
      relations: {},
    });

    if (!globalstorage) {
      throw new NotFoundException(`IDsi ${id} bo'lgan globalstorage topilmadi.`);
    }
    return globalstorage;
  }

  

  // 4. Globalstorage'ni yangilash (Relation ob'ekt bilan)
  async update(id: number, updateGlobalstorageDto: UpdateGlobalstorageDto) {
    // Avval ushbu IDli ma'lumot borligini tekshiramiz
    await this.findOne(id);

    // DTO ichidan foreign_id va qolgan ma'lumotlarni ajratib olamiz
    const { analysis_id,company_id, ...storageData } = updateGlobalstorageDto

    // preload() mavjud ma'lumotni yangi qiymatlar bilan qisman yangilaydi
    const globalstorage = await this.globalstorageRepository.preload({
      id: id,
      ...storageData,
    });

    if (!globalstorage) {
      throw new NotFoundException(`IDsi ${id} bo'lgan globalstorage topilmadi.`);
    }

    if (analysis_id) {
      const analysis = await this.analysisServie.findOne(analysis_id);
      globalstorage.analysis = analysis;
    }

     if (company_id) {
      const company= await this.companyService.findOne(company_id);
      globalstorage.company = company;
    }

    return await this.globalstorageRepository.save(globalstorage);
  }

  // 5. Globalstorage'ni o'chirish
  async remove(id: number): Promise<void> {
    const globalstorage = await this.findOne(id);
    await this.globalstorageRepository.remove(globalstorage);
  }
}
