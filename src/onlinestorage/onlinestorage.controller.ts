import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OnlinestorageService } from './onlinestorage.service';
import { CreateOnlinestorageDto } from './dto/create-onlinestorage.dto';
import { UpdateOnlinestorageDto } from './dto/update-onlinestorage.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('onlinestorage')
export class OnlinestorageController {
  constructor(private readonly onlinestorageService: OnlinestorageService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  create(@Body() createOnlinestorageDto: CreateOnlinestorageDto) {
    return this.onlinestorageService.create(createOnlinestorageDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getall")
  findAll() {
    return this.onlinestorageService.findAll();
  }

  @UseGuards(AuthGuard("jwt"))
    @Get("getfull")
    findAllPagSearch(
      @Query("page") page: string,
      @Query("limit") limit: string,
      @Query("search") search: string
    ) {
      return this.onlinestorageService.findAllPagSearch(+page, +limit, search);
    }

  @UseGuards(AuthGuard("jwt"))
  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.onlinestorageService.findOne(+id);
  }

  
  @Get('getbytwo/:id')
  findOneWithOutToken(@Param('id') id: string) {
    return this.onlinestorageService.findOneWithOutToken(+id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateOnlinestorageDto: UpdateOnlinestorageDto) {
    return this.onlinestorageService.update(+id, updateOnlinestorageDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.onlinestorageService.remove(+id);
  }
}
