import { Analysis } from "src/analysis/entities/analysis.entity";
import { Company } from "src/company/entities/company.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Onlinestorage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    text: string;

    @ManyToOne(() => Analysis)
    @JoinColumn({ name: "analysis_id" })
    analysis: Analysis;

    @ManyToOne(() => Company)
    @JoinColumn({ name: "company_id" })
    company: Company;

    @CreateDateColumn()
    createdAt: Date;


}
