import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import * as dotenv from 'dotenv';
import { VerifyTokenMiddleware } from './verify-token.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { PcModule } from './pc/pc.module';
import { PcController } from './pc/pc.controller';
import { MemoriaModule } from './memoria/memoria.module';
import { OtrosModule } from './otros/otros.module';
dotenv.config();

@Module({
  imports: [
    UserModule,
    PcModule,
    MongooseModule.forRoot(process.env.URL_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    MemoriaModule,
    OtrosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('ACA MIDDLEWARE PRINCIPAL')
    consumer.apply(VerifyTokenMiddleware).exclude(
        {
          path: 'user/img/:tipoImagen/:imagen',
          method: RequestMethod.GET
        },
        {
          path: 'pc',
          method: RequestMethod.GET,
        },
        {
          path: 'user/login',
          method: RequestMethod.POST,
        },
        {
          path: 'pc/uploadImgs',
          method: RequestMethod.POST,
        },
        // {
        //   path: 'user/create',
        //   method: RequestMethod.POST,
        // },
        {
          path: 'user/upload/',
          method: RequestMethod.PUT,
        },
        {
          path: 'user/upload/:tipoImagen/:id',
          method: RequestMethod.PUT,
        },
        ).forRoutes(UserController);
      
  }
}
