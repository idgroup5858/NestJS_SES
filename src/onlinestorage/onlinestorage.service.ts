import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Onlinestorage } from './entities/onlinestorage.entity'; // Entity manzili
import { CreateOnlinestorageDto } from './dto/create-onlinestorage.dto';
import { UpdateOnlinestorageDto } from './dto/update-onlinestorage.dto';
import { AnalysisService } from 'src/analysis/analysis.service';
import { ClsService } from 'nestjs-cls';
import { CompanyService } from 'src/company/company.service';
// Bog'langan servis (agar bo'lsa)

@Injectable()
export class OnlinestorageService {
  constructor(
    @InjectRepository(Onlinestorage)
    private readonly onlinestorageRepository: Repository<Onlinestorage>,

    private analysisServie: AnalysisService,
    private readonly cls: ClsService,
    private companyService: CompanyService,
  ) { }

  // 1. Onlinestorage yaratish (Relation ob'ekt bilan)
  async create(createOnlinestorageDto: CreateOnlinestorageDto) {
    const company_id = this.cls.get<number>('company_id');
    console.log("storage create company_id");
    console.log(company_id);

    const { analysis_id, ...rest } = createOnlinestorageDto



    const onlinestorage = this.onlinestorageRepository.create({
      ...rest
    });

    if (analysis_id) {
      const analysis = await this.analysisServie.findOne(createOnlinestorageDto.analysis_id)
      if (!analysis) throw new NotFoundException("Analysis not found");
      onlinestorage.analysis = analysis
    }
    if (company_id) {
      const company = await this.companyService.findOne(company_id)
      if (!company) throw new NotFoundException("Company not found");
      onlinestorage.company = company;
    }

    return await this.onlinestorageRepository.save(onlinestorage);
  }

  // 2. Barcha Onlinestorage'larni ob'ekti bilan birga yuklash
  async findAll() {
    const company_id = this.cls.get<number>('company_id');
    console.log("storage findall company_id");
    console.log(company_id);

    return await this.onlinestorageRepository.find({
      where: { company: { id: company_id } },
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
    // CLS dan kompaniya ID sini olamiz
    const company_id = this.cls.get<number>('company_id');

    // Sahifalash (Pagination) default qiymatlarini sozlash
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const skip = (page - 1) * limit;

    // QueryBuilder yaratamiz va bog'langan munosabatlarni yuklaymiz
    const query = this.onlinestorageRepository.createQueryBuilder('onlinestorage')
      .leftJoinAndSelect('onlinestorage.analysis', 'analysis')       // Agar userga bog'langan bo'lsa
    //.leftJoinAndSelect('storage.folder', 'folder');  // Agar papkaga bog'langan bo'lsa

    // DIQQAT: Doimo asosiy majburiy shartni (company_id) birinchi bo'lib WHERE bilan boshlaymiz
    if (company_id) {
      query.where('onlinestorage.company_id = :company_id', { company_id });
    }

    // Qidiruv — fayl nomi yoki tavsifi bo'yicha (ILIKE - registrga qaramasdan qidiradi)
    if (search) {
      query.andWhere(
        '(onlinestorage.name ILIKE :search OR storage.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }



    // Ma'lumotlarni olish va umumiy sonini hisoblash
    const [data, total] = await query
      .orderBy('onlinestorage.createdAt', 'DESC') // Yangi qo'shilganlar birinchi chiqadi
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
  async findOne(id: number): Promise<Onlinestorage> {
    const company_id = this.cls.get<number>('company_id');
    console.log("storage findone company_id");
    console.log(company_id);
    const onlinestorage = await this.onlinestorageRepository.findOne({
      where: { id, company: { id: company_id } },
      relations: {
        // foreignEntity: true // Bog'langan ob'ektni qo'shib yuklaydi
      },
    });

    if (!onlinestorage) {
      throw new NotFoundException(`IDsi ${id} bo'lgan onlinestorage topilmadi.`);
    }
    return onlinestorage;
  }

  // 4. Onlinestorage'ni yangilash (Relation ob'ekt bilan)
  async update(id: number, updateOnlinestorageDto: UpdateOnlinestorageDto) {
    // Avval ushbu IDli ma'lumot borligini tekshiramiz
    await this.findOne(id);

    // DTO ichidan foreign_id va qolgan ma'lumotlarni ajratib olamiz
    const { analysis_id, ...storageData } = updateOnlinestorageDto

    // preload() mavjud ma'lumotni yangi qiymatlar bilan qisman yangilaydi
    const onlinestorage = await this.onlinestorageRepository.preload({
      id: id,
      ...storageData,
    });

    if (!onlinestorage) {
      throw new NotFoundException(`IDsi ${id} bo'lgan onlinestorage topilmadi.`);
    }

    if (analysis_id) {
      const analysis = await this.analysisServie.findOne(analysis_id);
      onlinestorage.analysis = analysis;
    }



    return await this.onlinestorageRepository.save(onlinestorage);
  }

  // 5. Onlinestorage'ni o'chirish
  async remove(id: number): Promise<void> {
    const onlinestorage = await this.findOne(id);
    await this.onlinestorageRepository.remove(onlinestorage);
  }
}
