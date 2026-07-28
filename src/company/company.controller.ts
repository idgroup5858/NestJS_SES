import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompanyService } from './company.service'; // Yo'lni tekshiring
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // 1. Yangi kompaniya qo'shish
  @Post("add")
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  // 2. Barcha kompaniyalarni oddiy ro'yxat shaklida olish
  @Get("getall")
  findAll() {
    return this.companyService.findAll();
  }

  // 3. Mukammal paginatsiya, status va global qidiruv bilan olish
  @Get("getfull")
  findAllPagSearch(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("search") search?: string
  ) {
    return this.companyService.findAllPagSearch(+page, +limit, search);
  }

  // 4. ID bo'yicha bitta kompaniya ma'lumotlarini olish
  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  // 5. Kompaniya ma'lumotlarini yangilash
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  // 6. Kompaniyani o'chirish
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
