import { Analysis } from "src/analysis/entities/analysis.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Laboratory {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @CreateDateColumn()
    createdAt:Date;


    @OneToMany(()=>Analysis,analysis=>analysis.laboratory)
    analysis:Analysis[];
}
