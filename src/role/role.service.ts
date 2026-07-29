import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity'; // O'zingizning entity yo'lingizni tekshiring
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // Bazaga ulanish

    readonly cls: ClsService,
  ) { }

  // Yangi rol yaratish (Masalan: ADMIN, USER)
  async create(createRoleDto: CreateRoleDto) {
    //const company_id = this.cls.get<number>('company_id');

    const checkRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name }
    });
    if (checkRole) throw new ConflictException("Role already exists");

    const role = this.roleRepository.create({
      ...createRoleDto,
      //company: { id: company_id }
    });
    return await this.roleRepository.save(role);
  }

  // Barcha rollarni olish
  async findAll() {
    const company_id = this.cls.get<number>('company_id');
    console.log("role  findall company_id");
    console.log(company_id);

    
   
    return await this.roleRepository.find({
      where: { company: {id:company_id} },
      relations: {
        company: true,
        user: true
      }

    });
  }
  

  // ENGMUHIM METOD: ID bo'yicha haqiqiy Role obyektini qidirib topish
  async findOne(id: number): Promise<Role> {
    const company_id = this.cls.get<number>('company_id');    
    console.log("role  findOne company_id");
    console.log(company_id);
    const role = await this.roleRepository.findOne({
      where: {
        id,
        company:{id:company_id}
      },
      relations: {
        user: true,
        company:true
      }
    });
    if (!role) {
      throw new NotFoundException(`ID: ${id} bo'lgan rol tizimda topilmadi!`);
    }
    return role; // Haqiqiy Role obyektini qaytaradi
  }



  async findOneCompany(id: number, company_id: number): Promise<Role> {

    const role = await this.roleRepository.findOne({
      where: {
        id,
        company: { id: company_id }
      },
      relations: {
        user: true
      }
    });
    if (!role) {
      throw new NotFoundException(`ID: ${id} bo'lgan rol tizimda topilmadi!`);
    }
    return role; // Haqiqiy Role obyektini qaytaradi
  }

  // Rol ma'lumotlarini yangilash
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id);
    const role = await this.roleRepository.preload({
      id,
      ...updateRoleDto,
    });
    if (!role) throw new NotFoundException(`Role not found`);
    return await this.roleRepository.save(role);
  }

  // Rolni o'chirish
  async remove(id: number) {
    const role = await this.findOne(id);
    return await this.roleRepository.remove(role);
  }
}
