import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) { }

  // 1. Yangi tahlil qo'shish
  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  create(@Body() createAnalysisDto: CreateAnalysisDto) {
    return this.analysisService.create(createAnalysisDto);
  }

  // 2. Barcha tahlillarni oddiy ro'yxat shaklida olish
  @UseGuards(AuthGuard("jwt"))
  @Get("getall")
  findAll() {
    return this.analysisService.findAll();
  }

  // 3. Paginatsiya va qidiruv (Search) bilan birga olish
  @UseGuards(AuthGuard("jwt"))
  @Get("getfull")
  findAllPagSearch(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("search") search: string
  ) {
    return this.analysisService.findAllPagSearch(+page, +limit, search);
  }

  // 4. ID bo'yicha bitta tahlilni olish
  @UseGuards(AuthGuard("jwt"))
  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.analysisService.findOne(+id);
  }

  // 5. Tahlilni yangilash
  @UseGuards(AuthGuard("jwt"))
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateAnalysisDto: UpdateAnalysisDto) {
    return this.analysisService.update(+id, updateAnalysisDto);
  }

  // 6. Tahlilni o'chirish
  @UseGuards(AuthGuard("jwt"))
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.analysisService.remove(+id);
  }
}
