import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_item.entity';
import { Repository } from 'typeorm';
import { Analysis } from 'src/analysis/entities/analysis.entity';
import { Laboratory } from 'src/laboratory/entities/laboratory.entity';
import { PatientService } from 'src/patient/patient.service';
import { UserService } from 'src/user/user.service';
import { RegionService } from 'src/region/region.service';
import { District } from 'src/region/entities/district.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { AnalysisService } from 'src/analysis/analysis.service';
import { LaboratoryService } from 'src/laboratory/laboratory.service';
import { CompanyService } from 'src/company/company.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    // Repository o'rniga shaxsiy Service lar ulanadi
    private readonly patientService: PatientService,
    private readonly districtService: RegionService,
    private readonly userService: UserService,
    // private readonly analysisService: AnalysisService,
    // private readonly laboratoryService: LaboratoryService

    private companyService: CompanyService,

    readonly cls: ClsService,


  ) { }

  async create(dto: CreateOrderDto): Promise<Order> {

    const company_id = this.cls.get<number>('company_id');
    console.log("order create company_id");
    console.log(company_id);

    const owner = await this.userService.findOne(dto.owner_id);


    let district: District | undefined = undefined
    if (dto.district_id) {
      district = await this.districtService.findOneDistrict(dto.district_id);
    }
    let patient: Patient | undefined = undefined
    if (dto.patient_id) {
      patient = await this.patientService.findOne(dto.patient_id)
    }

    // 1. DTO ichidagi items massividan umumiy summani hisoblaymiz
    const totalAmount = dto.items.reduce((sum, item) => sum + item.price, 0);

    // 2. Skidka (chegirma) miqdorini hisoblaymiz (agar foiz kelgan bo'lsa)
    let discountAmount = 0;
    if (dto.discount_percent && dto.discount_percent > 0) {
      discountAmount = (totalAmount * dto.discount_percent) / 100;
    }



    // 3. Yakuniy to'lanishi kerak bo'lgan summani hisoblaymiz
    const finalAmount = totalAmount - discountAmount;

    // 4. Asosiy Order obyektini yaratamiz
    const order = this.orderRepository.create({
      order_type: dto.order_type,
      name: dto.name,
      status: 'pending',
      payment_status: 'pending',
      payment_method: dto.payment_method,

      total_amount: totalAmount.toString(),
      discount_amount: discountAmount.toString(),
      final_amount: finalAmount.toString(),

      street: dto.street,
      village: dto.village,
      description: dto.description,

      district: district,
      owner: owner,
      patient: patient,
    });

    if (company_id) {
      const company = await this.companyService.findOne(company_id)
      if (!company.active) throw new NotFoundException("Company not active");
      if (!company) throw new NotFoundException("Company not found");
      order.company = company;
    }


    // 5. DTO ichidagi items ro'yxatini OrderItem entitylariga o'giramiz
    order.items = dto.items.map(itemDto => {
      const item = new OrderItem();
      item.analysis = { id: itemDto.analysis_id } as Analysis;
      item.laboratory = { id: itemDto.laboratory_id } as Laboratory;
      item.status = 'pending';
      return item;
    });

    // 6. { cascade: true } yordamida hammasini bitta tranzaksiyada bazaga saqlaymiz
    return await this.orderRepository.save(order);
  }


  async updateItemStatus(item_id: number, status: string): Promise<OrderItem> {
    console.log("this is");
    
    const item = await this.orderItemRepository.findOne({
      where: { id: item_id },
      relations: {
        order: {
          items: true,
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`OrderItem #${item_id} topilmadi`);
    }

    item.status = status;
    await this.orderItemRepository.save(item);

    // Item statusi o'zgargani sababli, Order statusini avtomatik yangilaymiz
    await this.recalculateOrderStatus(item.order.id);

    return item;
  }

  // ================================
  // ORDER statusini qo'lda yangilash
  // ================================
  async updateOrderStatus(order_id: number, status: string): Promise<Order> {

    const company_id = this.cls.get<number>('company_id');
    console.log("order create company_id");
    console.log(company_id);

    const order = await this.orderRepository.findOne({
      where: {
        id: order_id,
        company: { id: company_id }
      }
    });

    if (!order) {
      throw new NotFoundException(`Order #${order_id} topilmadi`);
    }

    order.status = status;
    return await this.orderRepository.save(order);
  }

  // ================================
  // TO'LOV statusini yangilash
  // ================================
  async updatePaymentStatus(order_id: number, status: string): Promise<Order> {
    const order = await this.findOne(order_id)

    if (!order) {
      throw new NotFoundException(`Order #${order_id} topilmadi`);
    }

    order.payment_status = status;
    return await this.orderRepository.save(order);
  }

  // ================================
  // Yordamchi: barcha item statuslariga qarab Order statusini avtomatik hisoblash
  // ================================
  async recalculateOrderStatus(order_id: number) {
    const order = await this.findOne(order_id);

    if (!order) {
      throw new NotFoundException(`Order #${order_id} topilmadi`);
    }

    const items = order.items;
    const allCompleted = items.every(i => i.status === 'completed');
    const anyCompleted = items.some(i => i.status === 'completed' || i.status === 'in_progress');

    if (allCompleted) {
      order.status = 'completed';
    } else if (anyCompleted) {
      order.status = 'partially_completed';
    } else {
      order.status = 'pending';
    }

    return await this.orderRepository.save(order);
  }

  async findAll() {
    const company_id = this.cls.get<number>('company_id');
    console.log("order findall company_id");
    console.log(company_id);
    
    return this.orderRepository.find({
      where:{company:{id:company_id}},
      relations: {
        items: {
          analysis: true,
          laboratory: true,
        },
        owner: true,
        patient: true,
        district: true,
      },
      order: {
        createdAt: 'DESC', // eng yangi buyurtmalar birinchi chiqishi uchun (ixtiyoriy)
      },
    });
  }

  async findAllPagSearch(
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ) {

     const company_id = this.cls.get<number>('company_id');

    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const skip = (page - 1) * limit;

    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.analysis', 'analysis')
      .leftJoinAndSelect('items.laboratory', 'laboratory')
      .leftJoinAndSelect('order.owner', 'owner')
      .leftJoinAndSelect('order.patient', 'patient')
      .leftJoinAndSelect('order.district', 'district');

    // Qidiruv — bemor ismi, manzil yoki tavsif bo'yicha
    if (search) {
      query.andWhere(
        '(patient.first_name ILIKE :search OR patient.last_name ILIKE :search OR order.street ILIKE :search OR order.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Status bo'yicha filtr
    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (company_id) {
      query.where('order.company_id = :company_id', { company_id: company_id });
    }

    const [data, total] = await query
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  }


  async findAllPagSearchOrderItem(
    page: number,
    limit: number,
    search?: string,
    status?: string,
    laboratory_id?: number
  ) {
    // Sahifalash qiymatlarini raqamga o'girish va default qiymatlar
    const currentPage = page > 0 ? Number(page) : 1;
    const currentLimit = limit > 0 ? Number(limit) : 10;
    const skip = (currentPage - 1) * currentLimit;


    const query = this.orderItemRepository.createQueryBuilder('item')
      .leftJoinAndSelect('item.analysis', 'analysis')
      .leftJoinAndSelect('item.laboratory', 'laboratory')
      .leftJoinAndSelect('item.order', 'order') // Analiz tegishli bo'lgan asosiy buyurtma
      .leftJoinAndSelect('order.patient', 'patient')
      .leftJoinAndSelect('order.owner', 'owner')
      .leftJoinAndSelect('order.district', 'district');
    if (laboratory_id) {
      query.where('laboratory.id = :laboratory_id', { laboratory_id: Number(laboratory_id) });
    }

    // 1. OrderItem'ning o'zini statusi bo'yicha filtr (masalan: 'pending', 'in_progress')
    if (status) {
      query.where('item.status = :status', { status });
    }

    // 2. Qidiruv — bemor ismi-sharifi, buyurtma manzili yoki tavsifi bo'yicha
    if (search) {
      query.andWhere(
        '(patient.first_name ILIKE :search OR patient.last_name ILIKE :search OR order.street ILIKE :search OR order.description ILIKE :search OR analysis.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sahifalash va ma'lumotlarni olish (Bir qatorga bitta analiz tushgani uchun offset/limit mukammal ishlaydi)
    const [data, total] = await query
      .orderBy('item.createdAt', 'DESC')
      .offset(skip)
      .limit(currentLimit)
      .getManyAndCount();

    return {
      meta: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages: Math.ceil(total / currentLimit),
      },
      data,
    };
  }



  async findAllPagSearchByLabId(
    page: number,
    limit: number,
    search?: string,
    status?: string,
    laboratory_id?: number
  ) {

    const company_id = this.cls.get<number>('company_id');
    // Sahifalash qiymatlarini tekshirish va default o'rnatish
    const currentPage = page > 0 ? Number(page) : 1;
    const currentLimit = limit > 0 ? Number(limit) : 10;
    const skip = (currentPage - 1) * currentLimit;

    // QueryBuilder boshlash
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.analysis', 'analysis')
      .leftJoinAndSelect('items.laboratory', 'laboratory')
      .leftJoinAndSelect('order.owner', 'owner')
      .leftJoinAndSelect('order.patient', 'patient')
      .leftJoinAndSelect('order.district', 'district');

    // Laboratoriya ID mavjud bo'lsa filter qilish
    if (laboratory_id) {
      query.where('laboratory.id = :laboratory_id', { laboratory_id: Number(laboratory_id) });
    }

    // Qidiruv — bemor ismi, manzil yoki tavsif bo'yicha
    if (search) {
      query.andWhere(
        '(patient.first_name ILIKE :search OR patient.last_name ILIKE :search OR order.street ILIKE :search OR order.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Status bo'yicha filtr
    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (company_id) {
      query.where('order.company_id = :company_id', { company_id: company_id });
    }

    // Tartiblash, sahifalash va natijani olish (.offset va .limit xatolikni oldini oladi)
    const [data, total] = await query
      .orderBy('order.createdAt', 'DESC')
      .offset(skip)
      .limit(currentLimit)
      .getManyAndCount();

    // Natijani qaytarish
    return {
      meta: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages: Math.ceil(total / currentLimit),
      },
      data,
    };
  }


  async findOne(id: number) {
    const company_id = this.cls.get<number>('company_id');
    console.log("order findOne company_id");
    console.log(company_id);

    const order = await this.orderRepository.findOne({
      where: { id,
        company:{id:company_id}
       },
      relations: {
        items: {
          analysis: true,
          laboratory: true,
        },
        owner: true,
        patient: true,
        district: true,
        result: {
          lab_director: true,
          result_item: true
        }
      },
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} topilmadi`);
    }
    return order;
  }

  async findOneWithOutToken(id: number) {
    
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        items: {
          analysis: true,
          laboratory: true,
        },
        owner: true,
        patient: true,
        district: true,
        result: {
          lab_director: true,
          result_item: true
        }
      },
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} topilmadi`);
    }
    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id)

    if (!order) {
      throw new NotFoundException(`Order #${id} topilmadi`);
    }

    // Oddiy maydonlarni yangilaymiz (kelgan bo'lsagina)
    if (dto.order_type !== undefined) order.order_type = dto.order_type;
    if (dto.name !== undefined) order.name = dto.name;
    if (dto.payment_method !== undefined) order.payment_method = dto.payment_method;
    if (dto.street !== undefined) order.street = dto.street;
    if (dto.village !== undefined) order.village = dto.village;
    if (dto.description !== undefined) order.description = dto.description;
    if (dto.payment_sms !== undefined) order.payment_sms = dto.payment_sms;
    if (dto.completed_sms !== undefined) order.completed_sms = dto.completed_sms;
    if (dto.result_link_sms !== undefined) order.result_link_sms = dto.result_link_sms;

    // Relation maydonlarni yangilaymiz
    if (dto.owner_id !== undefined) {
      order.owner = await this.userService.findOne(dto.owner_id);
    }
    if (dto.district_id !== undefined) {
      order.district = dto.district_id ? await this.districtService.findOneDistrict(dto.district_id) : null;
    }
    if (dto.patient_id !== undefined) {
      order.patient = dto.patient_id ? await this.patientService.findOne(dto.patient_id) : null;
    }

    // Agar items qayta yuborilsa — narxlarni qayta hisoblaymiz
    if (dto.items !== undefined) {
      const totalAmount = dto.items.reduce((sum, item) => sum + item.price, 0);

      let discountAmount = 0;
      if (dto.discount_percent && dto.discount_percent > 0) {
        discountAmount = (totalAmount * dto.discount_percent) / 100;
      }

      const finalAmount = totalAmount - discountAmount;

      order.total_amount = totalAmount.toString();
      order.discount_amount = discountAmount.toString();
      order.final_amount = finalAmount.toString();

      // Eski items'larni o'chirib, yangilarini yaratamiz
      // (cascade: true bo'lgani uchun, eski array'ni almashtirish yetarli,
      // lekin orphan bo'lib qolgan item'larni tozalash uchun orphanedRowAction kerak bo'lishi mumkin)
      order.items = dto.items.map(itemDto => {
        const item = new OrderItem();
        item.analysis = { id: itemDto.analysis_id } as Analysis;
        item.laboratory = { id: itemDto.laboratory_id } as Laboratory;
        item.status = 'pending';
        return item;
      });
    }

    return await this.orderRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.findOne(id)

    if (!order) {
      throw new NotFoundException(`Order #${id} topilmadi`);
    }

    await this.orderRepository.remove(order);
    // OrderItem'lar { onDelete: 'CASCADE' } bo'lgani uchun avtomatik o'chadi

    return { message: `Order #${id} muvaffaqiyatli o'chirildi` };
  }

  async removeItem(id: number) {
    const order_item = await this.orderItemRepository.findOne({ where: { id } });

    if (!order_item) {
      throw new NotFoundException(`Order_Item #${id} topilmadi`);
    }

    await this.orderItemRepository.remove(order_item);

    return { message: `Order_Item #${id} muvaffaqiyatli o'chirildi` };
  }


}
