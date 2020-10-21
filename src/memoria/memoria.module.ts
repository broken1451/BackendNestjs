import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MemoriaController } from './memoria.controller';
import { MemoriaService } from './memoria.service';
import { memoriaSchema } from './schema/memoria';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyTokenMiddleware } from '../verify-token.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'memorias', schema: memoriaSchema}])],
  controllers: [MemoriaController],
  providers: [MemoriaService]
})
export class MemoriaModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    console.log('aca middleware pcmodule')
    consumer.apply(VerifyTokenMiddleware)
    .exclude().forRoutes(MemoriaController);
  }
}
