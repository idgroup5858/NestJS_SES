import { Company } from "src/company/entities/company.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string; // Masalan: 'admin', 'user'

    @Column({ nullable: true })
    description: string; // Rol haqida qisqacha ma'lumot

    // @ManyToOne(() => Company)
    // @JoinColumn({ name: "company_id" })
    // company: Company;

    @CreateDateColumn()
    createdAt: Date;


    @OneToMany(() => User, user => user.role)
    user: User[]


}
