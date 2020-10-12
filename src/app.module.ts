import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';



@Module({
  imports: [UserModule, MongooseModule.forRoot('mongodb://localhost:27017/inventario',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule  {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply().exclude({path: '/user/create', method: RequestMethod.POST}).forRoutes(UserController)
    console.log('pase por el middleware');
  }
}

