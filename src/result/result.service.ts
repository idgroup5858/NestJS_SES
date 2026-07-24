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

@Injectable()
export class ResultService {
    constructor(
        @InjectRepository(Result)
        private readonly resultRepository: Repository<Result>,
    ) {}

    // Yangi Result va uning Itemlarini birga saqlash
    async create(dto: CreateResultDto): Promise<Result> {
        // 1. Asosiy Result obektini repository.create orqali toza yaratamiz (new Result yo'qotildi)
        const result = this.resultRepository.create({
            order: { id: dto.order_id } as Order,
            lab_director:{id:dto.lab_director_id}as User
        });

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
        return await this.resultRepository.find({
            relations: {
                order: true,
                result_item: {
                    analysis: true,
                },
            },
        });
    }

    // ID bo'yicha olish
    async findOne(id: number): Promise<Result> {
        const result = await this.resultRepository.findOne({
            where: { id },
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
