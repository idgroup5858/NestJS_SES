import { PartialType } from '@nestjs/mapped-types';
import { CreateOnlinestorageDto } from './create-onlinestorage.dto';

export class UpdateOnlinestorageDto extends PartialType(CreateOnlinestorageDto) {}
