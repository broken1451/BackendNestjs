import { Module } from '@nestjs/common';
import { OtrosService } from './otros.service';
import { OtrosController } from './otros.controller';

@Module({
  providers: [OtrosService],
  controllers: [OtrosController]
})
export class OtrosModule {}
