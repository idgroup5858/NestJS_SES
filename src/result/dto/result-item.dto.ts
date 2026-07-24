import { IsNumber, IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateResultItemDto {
    @IsNumber()
    @IsNotEmpty()
    analysis_id: number; // Faqat ID yuboriladi

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsOptional()
    have_or_not?: boolean;

    @IsString()
    @IsOptional()
    unit?: string;

    @IsString()
    @IsOptional()
    norm?: string;

    @IsNumber()
    @IsOptional()
    min?: number;

    @IsNumber()
    @IsOptional()
    max?: number;

    @IsString()
    @IsOptional()
    standard?: string;

    @IsBoolean()
    @IsOptional()
    have_or_notValue?: boolean;

    @IsString()
    @IsOptional()
    unitValue?: string;

    @IsString()
    @IsOptional()
    normValue?: string;

    @IsNumber()
    @IsOptional()
    minValue?: number;

    @IsNumber()
    @IsOptional()
    maxValue?: number;

    @IsString()
    @IsOptional()
    standardValue?: string;
}
