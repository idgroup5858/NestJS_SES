import { Analysis } from "src/analysis/entities/analysis.entity";
import { Company } from "src/company/entities/company.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Laboratory {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;


  @ManyToOne(() => Company)
  @JoinColumn({ name: "company_id" })
  company: Company;



  @OneToMany(() => Analysis, analysis => analysis.laboratory)
  analysis: Analysis[];



  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "lab_director_id" })
  lab_director: User;    // User|null 


  @ManyToMany(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinTable({
    name: "laboratory_assistants", // oraliq jadval nomi
    joinColumn: { name: "laboratory_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
  })
  lab_assistants: User[];
}





/*



// Yangi qo'shildi — User'ga tegmasdan, bir tomonlama
  @ManyToMany(() => User)
  @JoinTable({
    name: "laboratory_assistants", // oraliq jadval nomi
    joinColumn: { name: "laboratory_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
  })
  lab_assistants: User[];



  async addAssistant(laboratoryId: number, userId: number) {
  const laboratory = await this.laboratoryRepository.findOne({
    where: { id: laboratoryId },
    relations: ['lab_assistants'],
  });

  if (!laboratory) throw new NotFoundException('Laboratoriya topilmadi');

  const user = await this.userService.findOne(userId);

  laboratory.lab_assistants.push(user);
  return this.laboratoryRepository.save(laboratory);
}




// ASSISTENTLAR KO'P BO'LISHI UCHUN MANYTOMANY:
  @ManyToMany(() => User)
  @JoinTable({
    name: 'laboratory_assistants', // O'rtadagi yangi ulovchi jadval nomi
    joinColumn: { name: 'laboratory_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  assistants: User[]; // Massiv (Array) ko'rinishida bo'ladi

*/
