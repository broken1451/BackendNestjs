import { Test, TestingModule } from '@nestjs/testing';
import { OtrosService } from './otros.service';

describe('OtrosService', () => {
  let service: OtrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtrosService],
    }).compile();

    service = module.get<OtrosService>(OtrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
