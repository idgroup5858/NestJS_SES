import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Patient } from './entities/patient.entity'; // Entity yo'lingizni tekshirib oling
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { RegionService } from 'src/region/region.service';
import { UserService } from 'src/user/user.service';
import { CompanyService } from 'src/company/company.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>, // Bemorlar repozitoriyasi

    private readonly regionService: RegionService,
    private readonly userService: UserService,
    private companyService: CompanyService,

    readonly cls: ClsService,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const company_id = this.cls.get<number>('company_id');
    console.log('patient create company_id');
    console.log(company_id);

    await this.regionService.findOneDistrict(createPatientDto.district_id);
    await this.userService.findOne(createPatientDto.owner_id);

    const { district_id, owner_id, ...restData } = createPatientDto;

    // Bemor ob'ektini DeepPartial yordamida qonuniy va toza yaratamiz
    const patient = this.patientRepository.create({
      ...restData,
      district: { id: district_id }, // Tuman aloqasini ID orqali bog'laymiz
      owner: { id: owner_id },
    } as DeepPartial<Patient>);

    if (company_id) {
      const company = await this.companyService.findOne(company_id);
      if (!company) throw new NotFoundException('Company not found');
      patient.company = company;
    }

    return await this.patientRepository.save(patient);
  }

  async findAll() {
    const company_id = this.cls.get<number>('company_id');
    console.log('patient findall company_id');
    console.log(company_id);
    return await this.patientRepository.find({
      where: { company: { id: company_id } },
      relations: {
        district: {
          region: true, // Bemor -> Tuman -> Viloyat ko'rinishida hamma ma'lumotni bittada olib keladi
        },
        owner: true,
      },
      order: { id: 'DESC' }, // Eng yangi ro'yxatdan o'tgan bemorlar tepada chiqadi
    });
  }

  async findOne(id: number) {
    const company_id = this.cls.get<number>('company_id');
    console.log('patient findone company_id');
    console.log(company_id);
    const patient = await this.patientRepository.findOne({
      where: { id, company: { id: company_id } },
      relations: {
        district: { region: true },
        owner: true,
      },
    });

    if (!patient) {
      throw new NotFoundException(`ID: ${id} bo'lgan bemor topilmadi!`);
    }
    return patient;
  }

  async findAllPagSearch(page: number, limit: number, search?: string) {
    const company_id = this.cls.get<number>('company_id');

    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const skip = (page - 1) * limit;

    const query = this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.district', 'district')
      .leftJoinAndSelect('patient.owner', 'owner')
      .leftJoinAndSelect('district.region', 'region');

    if (company_id) {
      query.where('patient.company_id = :company_id', {
        company_id: company_id,
      });
    }

    if (search) {
      // Bo'sh joylarni tozalaymiz (masalan, foydalanuvchi adashib ikki marta probel bossa)
      const cleanSearch = search.trim();

      query.andWhere(
        `patient.first_name ILIKE :search OR 
      patient.last_name ILIKE :search OR 
      patient.passport_number ILIKE :search OR
      patient.phone ILIKE :search OR
      CONCAT(patient.last_name, ' ', patient.first_name) ILIKE :search OR
      CAST(patient.id AS TEXT) LIKE :exactSearch OR
      CAST(patient.birth_day AS TEXT) LIKE :exactSearch
      `,
        {
          search: `%${cleanSearch}%`, // Ism va familiya uchun qisman qidiruv
          exactSearch: `${cleanSearch}%`, // ID va Tug'ilgan kun uchun boshlanishidan aniq qidiruv
        },
      );
    }

    const [data, total] = await query
      .orderBy('patient.id', 'DESC')
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

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    // 1. Avval bemor bazada borligini tekshiramiz
    await this.findOne(id);

    // 2. Agar district_id kelgan bo'lsa (va u 0 bo'lmasa), tuman borligini tekshiramiz
    if (
      updatePatientDto.district_id !== undefined &&
      updatePatientDto.district_id !== null
    ) {
      await this.regionService.findOneDistrict(updatePatientDto.district_id);
    }

    // 3. Preload ichiga hamma narsani to'g'ridan-to'g'ri DeepPartial bilan berib yuboramiz
    const patient = await this.patientRepository.preload({
      id,
      ...updatePatientDto,
      // Agar district_id kelgan bo'lsa obyekt ichiga district: { id } ni qo'shadi
      ...(updatePatientDto.district_id && {
        district: { id: updatePatientDto.district_id },
      }),
    } as DeepPartial<Patient>);

    if (!patient)
      throw new NotFoundException('Patient not found during preload');

    // 4. Bazaga saqlaymiz
    await this.patientRepository.save(patient);

    // 5. To'liq aloqalari bilan qaytaramiz
    return this.findOne(id);
  }

  // 5. Bemor o'chirilganda chiroyli xabar qaytarish
  async remove(id: number) {
    const patient = await this.findOne(id); // Avval borligini tekshiramiz
    await this.patientRepository.remove(patient); // O'chiramiz

    return {
      success: true,
      message: 'Patient deleted successfully',
      id: id,
    };
  }
}
