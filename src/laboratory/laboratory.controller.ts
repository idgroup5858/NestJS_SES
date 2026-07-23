import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { CreateLaboratoryDto } from './dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from './dto/update-laboratory.dto';

@Controller('laboratory')
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) { }

  @Post("add")
  create(@Body() createLaboratoryDto: CreateLaboratoryDto) {
    return this.laboratoryService.create(createLaboratoryDto);
  }

  @Get("getall")
  findAll() {
    return this.laboratoryService.findAll();
  }

  @Get("getfull")
  findAllPagSearch(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("search") search: string
  ) {
    return this.laboratoryService.findAllPagSearch(+page, +limit, search);
  }

  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.laboratoryService.findOne(+id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateLaboratoryDto: UpdateLaboratoryDto) {
    return this.laboratoryService.update(+id, updateLaboratoryDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.laboratoryService.remove(+id);
  }
}
