import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Laboratory } from './entities/laboratory.entity';
import { CreateLaboratoryDto } from './dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from './dto/update-laboratory.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LaboratoryService {
  constructor(
    @InjectRepository(Laboratory)
    private readonly laboratoryRepository: Repository<Laboratory>,

    private userService: UserService
  ) { }


  async create(createLaboratoryDto: CreateLaboratoryDto) {

    const { lab_director_id, ...rest } = createLaboratoryDto;

    const laboratory = this.laboratoryRepository.create({
      ...rest
    });

    if (createLaboratoryDto.lab_director_id) {
      const user = await this.userService.findOne(createLaboratoryDto.lab_director_id);
      laboratory.lab_director = user
    }
    return await this.laboratoryRepository.save(laboratory);
  }

  async findAll() {
    return await this.laboratoryRepository.find({
      relations: {
        analysis: true,
        lab_director: true,
        lab_assistants:true
      }
    });
  }

  async findAllPagSearch(page: number, limit: number, search?: string) {
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const skip = (page - 1) * limit;

    const query = this.laboratoryRepository.createQueryBuilder('laboratory')
      .leftJoinAndSelect('laboratory.analysis', 'analysis')
      .leftJoinAndSelect('laboratory.lab_director', 'lab_director')
      .leftJoinAndSelect('laboratory.lab_assistants', 'lab_assistants')

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
      where: { id: id },
      relations: {
        analysis: true,
        lab_director: true,
        lab_assistants:true
      }
    });


    if (!laboratory) {
      throw new NotFoundException(`ID: ${id} bo'lgan laboratoriya topilmadi!`);
    }
    return laboratory;
  }




  async update(id: number, updateLaboratoryDto: UpdateLaboratoryDto) {
    const { lab_director_id, ...rest } = updateLaboratoryDto;

    const laboratory = await this.laboratoryRepository.preload({ 
      id, ...rest
     });

    if (!laboratory) {
      throw new NotFoundException(`ID: ${id} bo'lgan laboratoriya topilmadi!`);
    }

    if (lab_director_id !== undefined) {
      const lab = await this.userService.findOne(lab_director_id);
      laboratory.lab_director = lab
    }

    return this.laboratoryRepository.save(laboratory);
  }

  // async update(id: number, updateLaboratoryDto: UpdateLaboratoryDto) {
  //     const { lab_director_id, ...rest } = updateLaboratoryDto;

  //     const laboratory = await this.laboratoryRepository.preload({ id, ...rest });

  //     if (!laboratory) {
  //       throw new NotFoundException(`ID: ${id} bo'lgan laboratoriya topilmadi!`);
  //     }

  //     if (lab_director_id !== undefined) {
  //       laboratory.lab_director = lab_director_id
  //         ? await this.userService.findOne(lab_director_id)
  //         : null;
  //     }

  //     return this.laboratoryRepository.save(laboratory);
  //   }


  async remove(id: number) {
    const laboratory = await this.findOne(id);
    await this.laboratoryRepository.remove(laboratory);


    return {
      success: true,
      message: 'Laboratory deleted successfully',
      id: id,
    };
  }


 async addAssistant(laboratoryId: number, userId: number) {
  const laboratory = await this.laboratoryRepository.findOne({
    where: { id: laboratoryId },
    relations: { lab_assistants: true },
  });

  if (!laboratory) throw new NotFoundException('Laboratoriya topilmadi');

  const user = await this.userService.findOne(userId);

  const alreadyExists = laboratory.lab_assistants.find((a) => a.id === userId);

  if (alreadyExists) {
    throw new ConflictException('Bu foydalanuvchi allaqachon assistant');
  }

  laboratory.lab_assistants.push(user);
  return this.laboratoryRepository.save(laboratory);
}

async removeAssistant(laboratoryId: number, userId: number) {
  const laboratory = await this.laboratoryRepository.findOne({
    where: { id: laboratoryId },
    relations: { lab_assistants: true },
  });

  if (!laboratory) throw new NotFoundException('Laboratoriya topilmadi');

  const assistant = laboratory.lab_assistants.find((a) => a.id === userId);

  if (!assistant) {
    throw new NotFoundException('Bu foydalanuvchi laboratoriya assistanti emas');
  }

  laboratory.lab_assistants = laboratory.lab_assistants.filter(
    (a) => a.id !== userId,
  );

  return this.laboratoryRepository.save(laboratory);
}



}
