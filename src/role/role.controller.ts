import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }


  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  //@UseGuards(AuthGuard("jwt"))
  @Post("addrolewithcompany")
  createRoleWithCompany(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRoleWithCompany(createRoleDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getall")
  findAll() {
    return this.roleService.findAll();
  }


  @UseGuards(AuthGuard("jwt"))
  @Get('getby/:id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }
  @UseGuards(AuthGuard("jwt"))
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }
  @UseGuards(AuthGuard("jwt"))
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }

}
