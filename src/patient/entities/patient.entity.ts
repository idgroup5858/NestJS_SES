import { District } from "src/region/entities/district.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Patient {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ type: 'date', nullable: true })
    birth_day: string;

    @Column()
    phone: string;

    @Column()
    sex: number;

    @Column({nullable:true})
    village: string;

    @Column({nullable:true})
    passport_number: string;

    @Column({nullable:true})
    street: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(()=>District)
    @JoinColumn({name:"district_id"})
    district:District;

    @ManyToOne(()=>User,{onDelete:"RESTRICT"}) //User delted bo'lganda Patient delte bo'lishini taqiqlash
    @JoinColumn({name:"owner_id"})
    owner:User;




}
