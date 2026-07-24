import { Analysis } from "src/analysis/entities/analysis.entity";
import { Laboratory } from "src/laboratory/entities/laboratory.entity";
import { Patient } from "src/patient/entities/patient.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    order_type:string; //patient //sample //course


    @ManyToOne(()=>Laboratory)
    laboratory:Laboratory;

    @ManyToOne(()=>Analysis)
    analysis:Analysis;

    @ManyToOne(()=>User)
    owner:User;

    @ManyToOne(()=>Patient,{nullable:true})
    patient:Patient;

    






    
}
