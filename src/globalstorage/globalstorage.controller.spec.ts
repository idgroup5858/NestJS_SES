import { Test, TestingModule } from '@nestjs/testing';
import { GlobalstorageController } from './globalstorage.controller';
import { GlobalstorageService } from './globalstorage.service';

describe('GlobalstorageController', () => {
  let controller: GlobalstorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalstorageController],
      providers: [GlobalstorageService],
    }).compile();

    controller = module.get<GlobalstorageController>(GlobalstorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
