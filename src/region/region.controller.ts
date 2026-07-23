import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegionService } from './region.service';


@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  

  @Get("getallregion")
  findAll() {
    return this.regionService.findAll();
  }

  @Get("getalldistrict")
  findAlDistrict() {
    return this.regionService.findAllDistrict();
  }

  @Get('getby/region/:id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(+id);
  }

  @Get('getby/district/:id')
  findOneDistrict(@Param('id') id: string) {
    return this.regionService.findOneDistrict(+id);
  }

  
}
