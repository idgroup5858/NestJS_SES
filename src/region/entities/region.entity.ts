import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { District } from "./district.entity";

@Entity()
export class Region {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true ,nullable:true,name:"name_lat"})
    name: string; 

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(()=>District,district=>district.region)
    district:District[];
}
