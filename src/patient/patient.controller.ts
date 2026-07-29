import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) { }

  // 1. Yangi bemor qo'shish
  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  // 2. Barcha bemorlarni oddiy ro'yxat shaklida olish
  @UseGuards(AuthGuard("jwt"))
  @Get("getall")
  findAll() {
    return this.patientService.findAll();
  }

  // 3. Mukammal paginatsiya, pasport va ism bo'yicha qidiruv bilan olish
  @UseGuards(AuthGuard("jwt"))
  @Get("getfull")
  findAllPagSearch(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("search") search: string
  ) {
    return this.patientService.findAllPagSearch(+page, +limit, search);
  }

  // 4. ID bo'yicha bitta bemor ma'lumotlarini olish
  @UseGuards(AuthGuard("jwt"))
  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(+id);
  }

  // 5. Bemor ma'lumotlarini va tumanini yangilash
  @UseGuards(AuthGuard("jwt"))
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(+id, updatePatientDto);
  }

  // 6. Bemor xizmatini o'chirish
  @UseGuards(AuthGuard("jwt"))
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.patientService.remove(+id);
  }
}
