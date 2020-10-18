import { Test, TestingModule } from '@nestjs/testing';
import { OtrosController } from './otros.controller';

describe('OtrosController', () => {
  let controller: OtrosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtrosController],
    }).compile();

    controller = module.get<OtrosController>(OtrosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
