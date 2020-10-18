import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OtrosService } from './otros.service';
import { OtrosController } from './otros.controller';
import { VerifyTokenMiddleware } from '../verify-token.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { otrosSchema } from './schema/otros';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'otros', schema: otrosSchema}])],
  providers: [OtrosService],
  controllers: [OtrosController]
})
export class OtrosModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('aca middleware pcmodule')
    consumer.apply(VerifyTokenMiddleware)
    .exclude().forRoutes(OtrosController);
  }
}
