import { Test, TestingModule } from '@nestjs/testing';
import { MemoriaController } from './memoria.controller';

describe('MemoriaController', () => {
  let controller: MemoriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemoriaController],
    }).compile();

    controller = module.get<MemoriaController>(MemoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
