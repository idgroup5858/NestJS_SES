
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity'; // Yo'lni tekshiring
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // Yangi kompaniya yaratish
  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(company);
  }

  // Barcha kompaniyalarni olish
  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

    async findAllPagSearch(
    page: number,
    limit: number,
    search?: string
  ) {
    // 1. Sahifa va limitni xavfsiz qiymatlarga keltiramiz
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;
    const skip = (page - 1) * limit;

    // 2. QueryBuilder yaratamiz va kerakli munosabatlarni bog'laymiz
    const query = this.companyRepository.createQueryBuilder('company')
      // Agar kompaniyaga bog'langan boshqa jadvallar bo'lsa, shu yerda leftJoin qilinadi
      // .leftJoinAndSelect('company.users', 'users') 

    // 3. Global qidiruv mantiqi (Nomi, Tavsifi yoki Manzili bo'yicha)
    if (search) {
      query.andWhere(
        '(company.name ILIKE :search OR company.description ILIKE :search OR company.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // // 4. Status bo'yicha filtr (masalan: active, inactive)
    // if (status) {
    //   query.andWhere('company.status = :status', { status });
    // }

    // 5. Ma'lumotlarni tartiblab, skip/take bilan bazadan yuklaymiz
    const [data, total] = await query
      .orderBy('company.createdAt', 'DESC') // Yangi qo'shilganlar birinchi chiqadi
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // 6. Standart Meta ma'lumotlar bilan natijani qaytaramiz
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


  // ID bo'yicha bitta kompaniyani topish
  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`ID: ${id} bo'lgan kompaniya topilmadi`);
    }
    return company;
  }

  // Kompaniyani yangilash
  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);
    const updatedCompany = this.companyRepository.merge(company, updateCompanyDto);
    return await this.companyRepository.save(updatedCompany);
  }

  // Kompaniyani o'chirish
  async remove(id: number): Promise<{ message: string }> {
    const company = await this.findOne(id);
    await this.companyRepository.remove(company);
    return { message: 'Kompaniya muvaffaqiyatli oʻchirildi' };
  }
}
