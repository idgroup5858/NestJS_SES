import { Company } from "src/company/entities/company.entity";
import { Role } from "src/role/entities/role.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    username:string;
    @Column()
    surname:string;
    @Column({unique:true})
    email:string;
    @Column()
    password:string;

    // @ManyToOne(()=>Company)
    // @JoinColumn({name:"company_id"})
    // company:Company;


    @CreateDateColumn()
    createdAt:Date;

    @JoinColumn({ name: 'role_id' })
    @ManyToOne(()=>Role, role=>role.user,{onDelete:"SET NULL",nullable:true}) //cascade: true — Bu Saqlash (Insert/Update)  //faqat onDeleteUchun //CASCADE (Zanjirli o'chirish) //NO ACTION (Standart holat) //o'chirishni taqiqlaydi //SET DEFAULT //foydalanuvchining roli jadvaldagi standart (default) qiymatga qaytadi.
    role:Role;

}
