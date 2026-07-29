import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateOrderItemStatusDto, UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/update-order.dto';
import { IsIn, IsNotEmpty } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @UseGuards(AuthGuard("jwt"))
  @Post("add")
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getall")
  findAll(

  ) {
    return this.orderService.findAll();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getfull")
  findAllPag(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('status') status: string,
  ) {
    return this.orderService.findAllPagSearch(page, limit, search, status);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("getfull/labid/")
  findAllPagByLabId(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('status') status: string,
    @Query('lab_id') lab_id: string,
  ) {
    return this.orderService.findAllPagSearchByLabId(page, limit, search, status, +lab_id);
  }


  @UseGuards(AuthGuard("jwt"))
  @Get("getfull/item")
  findAllPagItems(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('status') status: string,
     @Query('lab_id') lab_id: string,
  ) {
    return this.orderService.findAllPagSearchOrderItem(page, limit, search, status,+lab_id);
  }

  // ================================
  // Bitta order'ni olish
  // GET /order/5
  // ================================
  @UseGuards(AuthGuard("jwt"))
  @Get('getby/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  // ================================
  // Order'ni to'liq/qisman yangilash (manzil, items va h.k.)
  // PATCH /order/5
  // ================================
  @UseGuards(AuthGuard("jwt"))
  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, dto);
  }

  // ================================
  // Order statusini o'zgartirish (masalan: 'canceled')
  // PATCH /order/5/status
  // ================================
  @UseGuards(AuthGuard("jwt"))
  @Patch('update/order/status/:id')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, dto.status);
  }

  // ================================
  // To'lov statusini o'zgartirish
  // PATCH /order/5/payment-status
  // ================================
  @UseGuards(AuthGuard("jwt"))
  @Patch('update/payment/status/:id')
  updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.orderService.updatePaymentStatus(id, dto.status);
  }

  // ================================
  // OrderItem statusini o'zgartirish (laboratoriya paneli uchun)
  // PATCH /order/item/12/status
  // ================================
  @UseGuards(AuthGuard("jwt"))
  @Patch('update/item/status/:id')
  updateItemStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderItemStatusDto,
  ) {
    return this.orderService.updateItemStatus(id, dto.status);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch('update/recalculate/status/:id')
  recalculateOrderStatus(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.orderService.recalculateOrderStatus(id);
  }

  // ================================
  // Order'ni o'chirish
  // DELETE /order/5
  // ================================
  @UseGuards(AuthGuard("jwt"))
  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete('item/delete/:id')
  removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.removeItem(id);
  }
}



