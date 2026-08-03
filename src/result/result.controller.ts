import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultService.create(createResultDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getall")
  findAll() {
    return this.resultService.findAll();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getfull")
  findAllPagSearch(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("search") search: string
  ) {
    return this.resultService.findAllPagSearch(+page, +limit, search);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.resultService.findOne(+id);
  }

  @Get('getbytwo/:id')
  findOneWithOutToken(@Param('id') id: string) {
    return this.resultService.findOneWithOutToken(+id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultService.update(+id, updateResultDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.resultService.remove(+id);
  }
}
