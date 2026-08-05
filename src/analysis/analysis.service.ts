import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analysis } from './entities/analysis.entity'; // Entity yo'lingizni tekshirib oling
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { ClsService } from 'nestjs-cls';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis)
    private readonly analysisRepository: Repository<Analysis>, // Bazaga ulanish

    private laboratoryService: LaboratoryService,
    private companyService: CompanyService,
    readonly cls: ClsService,

  ) { }

  // 1. Yangi tahlil (analysis) yaratish
  async create(createAnalysisDto: CreateAnalysisDto) {
    const company_id = this.cls.get<number>('company_id');
    console.log("analysis create company_id");
    console.log(company_id);


    await this.laboratoryService.findOne(createAnalysisDto.laboratory_id)

    // const analysisCheck = await this.analysisRepository.findOne({
    //   where: { name: createAnalysisDto.name }
    // });
    // if (analysisCheck) {
    //   throw new ConflictException("Analysis already exist")
    // }

    const analysis = this.analysisRepository.create({
      ...createAnalysisDto,
      laboratory: { id: createAnalysisDto.laboratory_id }
    });

    if (company_id) {
      const company = await this.companyService.findOne(company_id)
      if (!company) throw new NotFoundException("Company not found");
      analysis.company = company
    }
    return await this.analysisRepository.save(analysis);
  }

  // 2. Barcha tahlillarni olish
  async findAll() {
    const company_id = this.cls.get<number>('company_id');
    console.log("analysis findall company_id");
    console.log(company_id);

    return await this.analysisRepository.find({
      where: { company: { id: company_id } },
      relations: {
        laboratory: { lab_director: true }
      }
    });
  }

  async findAllPagSearch(page: number, limit: number, search?: string) {


    const company_id = this.cls.get<number>('company_id');

    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const skip = (page - 1) * limit;

    const query = this.analysisRepository.createQueryBuilder('analysis')
      .leftJoinAndSelect('analysis.laboratory', 'laboratory')
    // .leftJoinAndSelect('user.classs', 'classs')
    // .leftJoinAndSelect('sale.items', 'items')
    // .leftJoinAndSelect('sale.payments', 'payments')
    // .leftJoinAndSelect('sale.user', 'user')
    // .leftJoinAndSelect('items.warehouse', 'warehouse')
    // .leftJoinAndSelect('items.product', 'product')
    // .leftJoinAndSelect('sale.customer', 'customer');


    if (search) {
      query.where(
        'analysis.name ILIKE :search OR analysis.shortname ILIKE :search',  //LIKE MYSQL ILIKE POSTGRESQL
        { search: `%${search}%` }
      );
    }

    if (company_id) {
      query.where('analysis.company_id = :company_id', { company_id: company_id });
    }

    const [data, total] = await query
      .orderBy('analysis.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  }

  // 3. ID bo'yicha bitta tahlilni topish
  async findOne(id: number) {

    const company_id = this.cls.get<number>('company_id');
    console.log("analysis findone company_id");
    console.log(company_id);

    const analysis = await this.analysisRepository.findOne({
      where: {
        id: id,
        company: { id: company_id }
      },
      relations: {
        laboratory: true,
        pattern: true
      }
    });
    if (!analysis) {
      throw new NotFoundException(`ID: ${id} bo'lgan tahlil topilmadi!`);
    }
    return analysis;
  }

  async findOneWithOutToken(id: number) {

  
    const analysis = await this.analysisRepository.findOne({
      where: {
        id: id },
      relations: {
        laboratory: true,
        pattern: true
      }
    });
    if (!analysis) {
      throw new NotFoundException(`ID: ${id} bo'lgan tahlil topilmadi!`);
    }
    return analysis;
  }

  // 4. Tahlil ma'lumotlarini yangilash
  async update(id: number, updateAnalysisDto: UpdateAnalysisDto) {
    await this.findOne(id)
    const analysis = await this.analysisRepository.preload({
      id,
      ...updateAnalysisDto,
    });
    if (!analysis) {
      throw new NotFoundException(`ID: ${id} bo'lgan tahlil topilmadi!`);
    }
    return await this.analysisRepository.save(analysis);
  }

  // 5. Tahlilni bazadan o'chirish va muvaffaqiyatli xabar qaytarish
  async remove(id: number) {
    const analysis = await this.findOne(id); // Avval borligini tekshiramiz
    await this.analysisRepository.remove(analysis); // O'chiramiz

    return {
      success: true,
      message: 'Analysis deleted successfully',
      id: id,
    };
  }
}
