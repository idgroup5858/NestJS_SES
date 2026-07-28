import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Company {


    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    name:string

    
    @Column()
    description:string

    
    @Column()
    address:string



    @CreateDateColumn()
    createdAt: Date;

}
