import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { CreateLaboratoryDto } from './dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from './dto/update-laboratory.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('laboratory')
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  create(@Body() createLaboratoryDto: CreateLaboratoryDto) {
    return this.laboratoryService.create(createLaboratoryDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getall")
  findAll() {
    return this.laboratoryService.findAll();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getfull")
  findAllPagSearch(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("search") search: string
  ) {
    return this.laboratoryService.findAllPagSearch(+page, +limit, search);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.laboratoryService.findOne(+id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateLaboratoryDto: UpdateLaboratoryDto) {
    return this.laboratoryService.update(+id, updateLaboratoryDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.laboratoryService.remove(+id);
  }


  // Lab assistant qo'shish
   @UseGuards(AuthGuard("jwt"))
  @Post('assistant/:id/:userId')
  addAssistant(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.laboratoryService.addAssistant(+id, +userId);
  }

  // Lab assistant olib tashlash
   @UseGuards(AuthGuard("jwt"))
  @Delete('assistant/:id/:userId')
  removeAssistant(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.laboratoryService.removeAssistant(+id, +userId);
  }
}
