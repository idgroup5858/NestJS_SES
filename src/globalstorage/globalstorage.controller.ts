import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe 
} from '@nestjs/common';
import { GlobalstorageService } from './globalstorage.service';
import { CreateGlobalstorageDto } from './dto/create-globalstorage.dto';
import { UpdateGlobalstorageDto } from './dto/update-globalstorage.dto';

@Controller('globalstorage')
export class GlobalstorageController {
  constructor(private readonly globalstorageService: GlobalstorageService) {}

  @Post("add")
  create(@Body() createGlobalstorageDto: CreateGlobalstorageDto) {
    return this.globalstorageService.create(createGlobalstorageDto);
  }

  @Get("getall")
  findAll() {
    return this.globalstorageService.findAll();
  }

  @Get('getfull')
  findAllPagSearch(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    return this.globalstorageService.findAllPagSearch(page, limit, search);
  }

  @Get('getby/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.globalstorageService.findOne(id);
  }

  

  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateGlobalstorageDto: UpdateGlobalstorageDto
  ) {
    return this.globalstorageService.update(id, updateGlobalstorageDto);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.globalstorageService.remove(id);
  }
}
