import { Test, TestingModule } from '@nestjs/testing';
import { MemoriaService } from './memoria.service';

describe('MemoriaService', () => {
  let service: MemoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemoriaService],
    }).compile();

    service = module.get<MemoriaService>(MemoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
