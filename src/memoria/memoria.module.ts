import { Module } from '@nestjs/common';
import { MemoriaController } from './memoria.controller';
import { MemoriaService } from './memoria.service';

@Module({
  controllers: [MemoriaController],
  providers: [MemoriaService]
})
export class MemoriaModule {}
