import { 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToOne, 
    JoinColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn 
} from 'typeorm';
import { Result } from './result.entity';     // Yo'lni tekshiring
import { Analysis } from 'src/analysis/entities/analysis.entity';

@Entity("result_item")
export class ResultItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Analysis, (analysis) => analysis.pattern, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'analysis_id' })
    analysis: Analysis;

    @ManyToOne(() => Result, (result) => result.result_item, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'result_id' })
    result: Result;

    @Column({ length: 255 })
    name: string; // Majburiy maydon

    // Quyidagi ixtiyoriy maydonlarga ? belgisi qo'shildi
    @Column({ nullable: true })
    have_or_not?: boolean;

    @Column({ length: 50, nullable: true })
    unit?: string;

    @Column({ type: 'text', nullable: true })
    norm?: string;

    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    min?: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    max?: number;

    @Column({ length: 255, nullable: true })
    standard?: string;

    @Column({ nullable: true })
    have_or_notValue?: boolean;

    @Column({ length: 50, nullable: true })
    unitValue?: string;

    @Column({ type: 'text', nullable: true })
    normValue?: string;

    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    minValue?: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
    maxValue?: number;

    @Column({ length: 255, nullable: true })
    standardValue?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
