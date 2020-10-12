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
dotenv.config();

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(process.env.URL_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .exclude(
        {
          path: 'user',
          method: RequestMethod.GET,
        },
        {
          path: 'user/login',
          method: RequestMethod.POST,
        },
        {
          path: 'user/create',
          method: RequestMethod.POST,
        }
      ).forRoutes(UserController);
  }
}
