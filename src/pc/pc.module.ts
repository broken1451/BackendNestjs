import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PcController } from './pc.controller';
import { PcService } from './pc.service';
import { MongooseModule } from '@nestjs/mongoose';
import { pcSchema } from './schema/pc';
import { VerifyTokenMiddleware } from '../verify-token.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'pcs', schema: pcSchema}])],
  controllers: [PcController],
  providers: [PcService]
})
export class PcModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('aca middleware pcmodule')
    consumer.apply(VerifyTokenMiddleware)
    .exclude( {
      path: 'pc/uploadImgs',
      method: RequestMethod.POST,
    }).forRoutes(PcController);
  }
}
