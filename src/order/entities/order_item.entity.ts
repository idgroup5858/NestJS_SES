import { Analysis } from "src/analysis/entities/analysis.entity";
import { Laboratory } from "src/laboratory/entities/laboratory.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";




@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    // Qaysi asosiy buyurtmaga (Order) tegishli ekanligi
    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;

    // Aynan qaysi analiz turi ekanligi
    @ManyToOne(() => Analysis)
    analysis: Analysis;

    // DIQQAT: Analiz qaysi laboratoriyaga tegishli ekanligi (Siz so'ragan qism)
    // Shunda bitta order ichidagi 2 ta analiz 2 xil laboratoriyaga ajrab keta oladi
    @ManyToOne(() => Laboratory)
    laboratory: Laboratory;

    // Analizning hozirgi holati
    @Column({ default: 'pending' })
    status: string; // 'pending' (kutilmoqda), 'in_progress' (jarayonda), 'completed' (tayyor)


    // Natija kiritilgan yoki o'zgartirilgan vaqt
    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}




/*


import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrderItem } from './OrderItem';

@Entity()
export class AnalysisResult {
    @PrimaryGeneratedColumn()
    id: number;

    // Qaysi buyurtma elementiga (analizga) tegishli ekanligi (Siz so'ragan bog'liqlik)
    @ManyToOne(() => OrderItem, (orderItem) => orderItem.results, { onDelete: 'CASCADE' })
    orderItem: OrderItem;

    // Ko'rsatkich nomi (Masalan: 'Gemoglobin', 'Leykotsit')
    @Column()
    parameter_name: string;

    // Laboratoriya xodimi kiritgan natija (Masalan: '140' yoki 'Norma')
    @Column()
    value: string;

    // O'sha vaqtdagi norma ko'rsatkichi (Masalan: '120-160')
    @Column({ nullable: true })
    reference_range: string;

    // O'lchov birligi (Masalan: 'g/l', '10^9/l')
    @Column({ nullable: true })
    unit: string;
}


import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';
import { Order } from './Order';
import { Analysis } from './Analysis';
import { Laboratory } from './Laboratory';
import { AnalysisResult } from './AnalysisResult'; // Yangi jadval

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;

    @ManyToOne(() => Analysis)
    analysis: Analysis;

    @ManyToOne(() => Laboratory)
    laboratory: Laboratory;

    @Column({ default: 'pending' })
    status: string; // 'pending', 'in_progress', 'completed'

    // DIQQAT: Ushbu analizga tegishli barcha natijalar ro'yxati
    @OneToMany(() => AnalysisResult, (result) => result.orderItem, { cascade: true })
    results: AnalysisResult[];

    @UpdateDateColumn()
    updatedAt: Date;
}


*/
