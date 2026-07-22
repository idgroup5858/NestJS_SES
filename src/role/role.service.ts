import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity'; // O'zingizning entity yo'lingizni tekshiring
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // Bazaga ulanish
  ) { }

  // Yangi rol yaratish (Masalan: ADMIN, USER)
  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  // Barcha rollarni olish
  async findAll() {
    return await this.roleRepository.find({
      relations: {
        user:true
      }
    });
  }

  // ENGMUHIM METOD: ID bo'yicha haqiqiy Role obyektini qidirib topish
  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException(`ID: ${id} bo'lgan rol tizimda topilmadi!`);
    }
    return role; // Haqiqiy Role obyektini qaytaradi
  }

  // Rol ma'lumotlarini yangilash
  async update(id: number, updateRoleDto: UpdateRoleDto) {
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
