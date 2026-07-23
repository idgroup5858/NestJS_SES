import { Laboratory } from "src/laboratory/entities/laboratory.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Analysis {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column({nullable:true})
    shortname:string;

    @Column({nullable:true})
    price:string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(()=> Laboratory,laboratory=>laboratory.analysis,{onDelete:"CASCADE"})
    @JoinColumn({name:"laboratory_id"})
    laboratory:Laboratory;
}
