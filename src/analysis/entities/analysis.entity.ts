import { Company } from "src/company/entities/company.entity";
import { Laboratory } from "src/laboratory/entities/laboratory.entity";
import { Pattern } from "src/pattern/entities/pattern.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Analysis {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    shortname: string;

    @Column({ nullable: true })
    price: string;

    @ManyToOne(() => Company)
    @JoinColumn({ name: "company_id" })
    company: Company;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Laboratory, laboratory => laboratory.analysis, { onDelete: "CASCADE" })
    @JoinColumn({ name: "laboratory_id" })
    laboratory: Laboratory;

    @OneToMany(() => Pattern, pattern => pattern.analysis, { nullable: true })
    pattern: Pattern[];
}
