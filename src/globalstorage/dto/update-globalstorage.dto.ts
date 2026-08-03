import { PartialType } from '@nestjs/mapped-types';
import { CreateGlobalstorageDto } from './create-globalstorage.dto';

export class UpdateGlobalstorageDto extends PartialType(CreateGlobalstorageDto) {}
