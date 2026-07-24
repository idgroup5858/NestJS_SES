import { Analysis } from 'src/analysis/entities/analysis.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';




@Entity('pattern')
export class Pattern {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Analysis, (analysis) => analysis.pattern, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'analysis_id' })
    analysis: Analysis;

    @Column({ length: 255 })
    name: string;

    @Column({ nullable: true })
    have_or_not: boolean;

    @Column({ length: 50, nullable: true })
    unit: string;

    @Column({ type: 'text', nullable: true })
    norm: string;

    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    min: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    max: number;

    @Column({ length: 255, nullable: true })
    standard: string;



    @Column({ nullable: true })
    have_or_notValue: boolean;

    @Column({ length: 50, nullable: true })
    unitValue: string;

    @Column({ type: 'text', nullable: true })
    normValue: string;

    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    minValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    maxValue: number;

    @Column({ length: 255, nullable: true })
    standardValue: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;


    
}