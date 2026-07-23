import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./region.entity";

@Entity()
export class District {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: true, name: "name_lat" })
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @JoinColumn({name:"region_id"})
    @ManyToOne(()=>Region,region=>region.district)
    region:Region

}
