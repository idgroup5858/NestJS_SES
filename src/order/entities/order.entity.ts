import { Analysis } from "src/analysis/entities/analysis.entity";
import { Laboratory } from "src/laboratory/entities/laboratory.entity";
import { Patient } from "src/patient/entities/patient.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./order_item.entity";
import { District } from "src/region/entities/district.entity";
import { Result } from "src/result/entities/result.entity";
import { Company } from "src/company/entities/company.entity";


@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    order_type: string; //patient //sample //course

    @Column({ nullable: true })
    name: string;

    @Column({ default: 'pending' })
    status: string; // 'pending', 'partially_completed', 'completed', 'canceled'

    // To'lov holati (alohida nazorat qilish uchun)
    @Column({ default: 'pending' })
    payment_status: string; // 'pending', 'paid', 'refunded'

    // To'lov turi
    @Column({ nullable: true })
    payment_method: string; // 'cash' (naqd), 'card' (plastik), 'click' va h.k.

    // Buyurtmaning umumiy summasi
    @Column()
    total_amount: string;

    @Column({ nullable: true })
    discount_amount: string;

    @Column({ nullable: true })
    final_amount: string;

    @Column({ nullable: true })
    street: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    village: string;

    @ManyToOne(() => District, { nullable: true })
    @JoinColumn({ name: "district_id" })
    district: District|null;



    @ManyToOne(() => Company)
    @JoinColumn({ name: "company_id" })
    company: Company;


    @ManyToOne(() => User)
    owner: User;


    @ManyToOne(() => Patient, { nullable: true })
    patient: Patient|null;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];

    @OneToMany(() => Result, (result) => result.order, { cascade: true,nullable:true })
    result: Result[];

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;    

}




//  // 2-holat: Agar order_type === 'sample' bo'lsa, shtrix-kod yoki namuna raqami yoziladi
    // @Column({ nullable: true })
    // sample_code: string; 

    // // 3-holat: Agar order_type === 'course' bo'lsa, tayyor paket ulanadi
    // @ManyToOne(() => Course, { nullable: true })
    // course: Course; 