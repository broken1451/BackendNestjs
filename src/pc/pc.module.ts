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
    .exclude(
        // {
        //   path: 'user',
        //   method: RequestMethod.GET,
        // },
        // {
        //   path: 'pc',
        //   method: RequestMethod.GET,
        // },
        // {
        //   path: 'user/login',
        //   method: RequestMethod.POST,
        // },
        // {
        //   path: 'user/create',
        //   method: RequestMethod.POST,
            
        // },
        // {
        //   path: 'user/upload/',
        //   method: RequestMethod.PUT,
        // },
        ).forRoutes(PcController);
      
  }
}
