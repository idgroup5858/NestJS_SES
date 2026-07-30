import { Test, TestingModule } from '@nestjs/testing';
import { OnlinestorageService } from './onlinestorage.service';

describe('OnlinestorageService', () => {
  let service: OnlinestorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlinestorageService],
    }).compile();

    service = module.get<OnlinestorageService>(OnlinestorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
