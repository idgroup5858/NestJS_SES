import { Test, TestingModule } from '@nestjs/testing';
import { OnlinestorageController } from './onlinestorage.controller';
import { OnlinestorageService } from './onlinestorage.service';

describe('OnlinestorageController', () => {
  let controller: OnlinestorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnlinestorageController],
      providers: [OnlinestorageService],
    }).compile();

    controller = module.get<OnlinestorageController>(OnlinestorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
