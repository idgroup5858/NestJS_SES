import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Company {


    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    name: string


    @Column()
    description: string


    @Column()
    address: string

    @Column({nullable:true})
    phone: string

    @Column({default:true})
    active: boolean


    @OneToMany(() => User, user => user.company)
    user: User[]



    @CreateDateColumn()
    createdAt: Date;

}
