import { Injectable } from '@nestjs/common';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { UpdatePatternDto } from './dto/update-pattern.dto';

@Injectable()
export class PatternService {
  create(createPatternDto: CreatePatternDto) {
    return 'This action adds a new pattern';
  }

  findAll() {
    return `This action returns all pattern`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pattern`;
  }

  update(id: number, updatePatternDto: UpdatePatternDto) {
    return `This action updates a #${id} pattern`;
  }

  remove(id: number) {
    return `This action removes a #${id} pattern`;
  }
}
