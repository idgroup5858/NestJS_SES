import { Order } from "src/order/entities/order.entity";
import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ResultItem } from "./result_item.entity";
import { User } from "src/user/entities/user.entity";


@Entity()
export class Result {


    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order,order=>order.result,{onDelete:"CASCADE"})
    order: Order;

    @OneToMany(() => ResultItem, result_item => result_item.result, { cascade: true })
    result_item: ResultItem[]

    @ManyToOne(() => User)
    lab_director:User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;



}
