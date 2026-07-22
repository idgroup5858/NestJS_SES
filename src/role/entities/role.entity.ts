import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string; // Masalan: 'admin', 'user'

    @Column({ nullable: true })
    description: string; // Rol haqida qisqacha ma'lumot

    @CreateDateColumn()
    createdAt: Date;


    @OneToMany(()=> User,user => user.role)
    user:User[]


}
