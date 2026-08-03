import { Test, TestingModule } from '@nestjs/testing';
import { GlobalstorageService } from './globalstorage.service';

describe('GlobalstorageService', () => {
  let service: GlobalstorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalstorageService],
    }).compile();

    service = module.get<GlobalstorageService>(GlobalstorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
