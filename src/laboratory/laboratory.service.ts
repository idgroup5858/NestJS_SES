import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Laboratory } from './entities/laboratory.entity'; // Entity yo'lingizni tekshirib oling
import { CreateLaboratoryDto } from './dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from './dto/update-laboratory.dto';

@Injectable()
export class LaboratoryService {
  constructor(
    @InjectRepository(Laboratory)
    private readonly laboratoryRepository: Repository<Laboratory>, // Bazaga ulanish
  ) {}

  // 1. Yangi laboratoriya yaratish
  async create(createLaboratoryDto: CreateLaboratoryDto) {
    const laboratory = this.laboratoryRepository.create(createLaboratoryDto);
    return await this.laboratoryRepository.save(laboratory);
  }

  // 2. Barcha laboratoriyalarni olish
  async findAll() {
    return await this.laboratoryRepository.find({
      relations:{
        analysis:true
      }
    });
  }

  async findAllPagSearch(page: number, limit: number, search?: string) {
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const skip = (page - 1) * limit;

    const query = this.laboratoryRepository.createQueryBuilder('laboratory')
       .leftJoinAndSelect('laboratory.analysis', 'analysis')
    // .leftJoinAndSelect('user.classs', 'classs')
    // .leftJoinAndSelect('sale.items', 'items')
    // .leftJoinAndSelect('sale.payments', 'payments')
    // .leftJoinAndSelect('sale.user', 'user')
    // .leftJoinAndSelect('items.warehouse', 'warehouse')
    // .leftJoinAndSelect('items.product', 'product')
    // .leftJoinAndSelect('sale.customer', 'customer');


    if (search) {
      query.where(
        'laboratory.name ILIKE :search', //LIKE MYSQL ILIKE POSTGRESQL
        { search: `%${search}%` }
      );
    }

    const [data, total] = await query
      .orderBy('laboratory.id', 'DESC')
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

  // 3. ID bo'yicha bitta laboratoriyani topish
  async findOne(id: number) {
    const laboratory = await this.laboratoryRepository.findOne({ 
      where:{id:id},
      relations:{
        analysis:true
      }
     });


    if (!laboratory) {
      throw new NotFoundException(`ID: ${id} bo'lgan laboratoriya topilmadi!`);
    }
    return laboratory;
  }

  // 4. Laboratoriya ma'lumotlarini yangilash
  async update(id: number, updateLaboratoryDto: UpdateLaboratoryDto) {
    const laboratory = await this.laboratoryRepository.preload({
      id,
      ...updateLaboratoryDto,
    });
    if (!laboratory) {
      throw new NotFoundException(`ID: ${id} bo'lgan laboratoriya topilmadi!`);
    }
    return await this.laboratoryRepository.save(laboratory);
  }

  // 5. Laboratoriyani bazadan o'chirish va muvaffaqiyatli xabar qaytarish
  async remove(id: number) {
    const laboratory = await this.findOne(id); // Avval borligini tekshiramiz
    await this.laboratoryRepository.remove(laboratory); // O'chiramiz
    
    // Siz xohlagan muvaffaqiyatli xabar:
    return {
      success: true,
      message: 'Laboratory deleted successfully',
      id: id,
    };
  }
}
