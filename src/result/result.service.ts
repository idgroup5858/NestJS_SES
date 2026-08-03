import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResultDto } from './dto/create-result.dto';
import { Result } from './entities/result.entity';
import { ResultItem } from './entities/result_item.entity';
import { Analysis } from 'src/analysis/entities/analysis.entity';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { UpdateResultDto } from './dto/update-result.dto';
import { CompanyService } from 'src/company/company.service';
import { ClsService } from 'nestjs-cls';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { AnalysisService } from 'src/analysis/analysis.service';

@Injectable()
export class ResultService {
    constructor(
        @InjectRepository(Result)
        private readonly resultRepository: Repository<Result>,
        private companyService: CompanyService,
        // private laboratoryService: LaboratoryService,
        // private analysisService: AnalysisService,
        readonly cls: ClsService,
    ) { }

    // Yangi Result va uning Itemlarini birga saqlash
    async create(dto: CreateResultDto): Promise<Result> {

        const company_id = this.cls.get<number>('company_id');
        console.log("result create company_id");
        console.log(company_id);
        // 1. Asosiy Result obektini repository.create orqali toza yaratamiz (new Result yo'qotildi)
        const result = this.resultRepository.create({
            order: { id: dto.order_id } as Order,
            lab_director: { id: dto.lab_director_id } as User
        });

        if (company_id) {
            const company = await this.companyService.findOne(company_id)
            if (!company) throw new NotFoundException("Company not found");
            result.company = company;
        }

        // 2. Siz so'ragan qism: itemlarni map orqali new ResultItem qilib yuklaymiz
        result.result_item = dto.result_item.map(itemDto => {
            const item = new ResultItem();

            item.analysis = { id: itemDto.analysis_id } as Analysis;

            item.name = itemDto.name;
            item.have_or_not = itemDto.have_or_not;
            item.unit = itemDto.unit;
            item.norm = itemDto.norm;
            item.min = itemDto.min;
            item.max = itemDto.max;
            item.standard = itemDto.standard;

            item.have_or_notValue = itemDto.have_or_notValue;
            item.unitValue = itemDto.unitValue;
            item.normValue = itemDto.normValue;
            item.minValue = itemDto.minValue;
            item.maxValue = itemDto.maxValue;
            item.standardValue = itemDto.standardValue;

            return item;
        });

        // 3. Cascade yordamida bitta tranzaksiyada saqlaymiz
        return await this.resultRepository.save(result);
    }

    // Barcha natijalarni bog'liqliklari bilan olish
    async findAll(): Promise<Result[]> {
        const company_id = this.cls.get<number>('company_id');
        console.log("result findall company_id");
        console.log(company_id);
        return await this.resultRepository.find({
            where: { company: { id: company_id } },
            relations: {
                order: true,
                result_item: {
                    analysis: true,
                },
            },
        });
    }

    async findAllPagSearch(page: number, limit: number, search?: string) {
        const company_id = this.cls.get<number>('company_id');

        // Sahifalash parametrlari validatsiyasi
        page = page > 0 ? page : 1;
        limit = limit > 0 ? limit : 10;
        const skip = (page - 1) * limit;

        // QueryBuilder yaratish
        const query = this.resultRepository.createQueryBuilder('result')
            .leftJoinAndSelect('result.order', 'order')
            .leftJoinAndSelect('order.patient', 'patient')
            .leftJoinAndSelect('result.result_item', 'result_item')

        // O'z munosabatlaringizni qo'shing

        // Kompaniya bo'yicha filter (Har doim birinchi shart sifatida tekshiriladi)
        if (company_id) {
            query.where('result.company_id = :company_id', { company_id });
        }

        // Patient ismi va familiyasi bo'yicha qidiruv
        if (search) {
            query.andWhere(
                `(
                patient.first_name ILIKE :search OR 
                patient.last_name ILIKE :search OR
                CONCAT(patient.first_name, ' ', patient.last_name) ILIKE :search
            )`,
                { search: `%${search}%` }
            );
        }

        // Qidiruv sharti (andWhere ishlatiladi, aks holda yuqoridagi company_id o'chib ketadi)
        // if (search) {
        //     query.andWhere(
        //         '(result.name ILIKE :search OR result.code ILIKE :search)', // Qidiriladigan maydonlar
        //         { search: `%${search}%` }
        //     );
        // }

        // Ma'lumotlarni olish va sanash
        const [data, total] = await query
            .orderBy('result.id', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        // Standart qaytish formati
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


    // ID bo'yicha olish
    async findOne(id: number): Promise<Result> {
        const company_id = this.cls.get<number>('company_id');
        console.log("result findOne company_id");
        console.log(company_id);
        const result = await this.resultRepository.findOne({
            where: {
                id,
                company: { id: company_id }
            },
            relations: {
                order: true,
                result_item: {
                    analysis: true,
                },
            },
        });

        if (!result) {
            throw new NotFoundException(`ID: ${id} bo'lgan natija topilmadi`);
        }
        return result;
    }

    async findOneWithOutToken(id: number): Promise<Result> {
       
        const result = await this.resultRepository.findOne({
            where: {
                id
            },
            relations: {
                order: true,
                result_item: {
                    analysis: true,
                },
            },
        });

        if (!result) {
            throw new NotFoundException(`ID: ${id} bo'lgan natija topilmadi`);
        }
        return result;
    }

    async update(id: number, dto: UpdateResultDto): Promise<Result> {
        // 1. Avval eski Resultni bazadan topamiz
        const result = await this.findOne(id);

        // 2. Asosiy bog'liqliklarni yangilaymiz
        if (dto.order_id) {
            result.order = { id: dto.order_id } as Order;
        }
        if (dto.lab_director_id) {
            result.lab_director = { id: dto.lab_director_id } as User;
        }

        // 3. Siz aytgan usul: Eski items'larni o'chirib, to'liq yangilarini yaratamiz
        if (dto.result_item) {
            result.result_item = dto.result_item.map(itemDto => {
                const item = new ResultItem();

                // Bu yerda id berilmaydi, yangi obyekt bo'lib yaratiladi
                item.analysis = { id: itemDto.analysis_id } as Analysis;
                item.name = itemDto.name;
                item.have_or_not = itemDto.have_or_not;
                item.unit = itemDto.unit;
                item.norm = itemDto.norm;
                item.min = itemDto.min;
                item.max = itemDto.max;
                item.standard = itemDto.standard;

                item.have_or_notValue = itemDto.have_or_notValue;
                item.unitValue = itemDto.unitValue;
                item.normValue = itemDto.normValue;
                item.minValue = itemDto.minValue;
                item.maxValue = itemDto.maxValue;
                item.standardValue = itemDto.standardValue;

                return item;
            });
        }

        // 4. { cascade: true } yordamida hammasini bitta tranzaksiyada saqlaymiz
        return await this.resultRepository.save(result);
    }



    // O'chirish (onDelete: 'CASCADE' sababli itemlar ham avtomat o'chadi)
    async remove(id: number): Promise<{ message: string }> {
        const result = await this.findOne(id);
        await this.resultRepository.remove(result);
        return { message: `Natija muvaffaqiyatli o'chirildi` };
    }
}
