import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import Server from './server'
dotenv.config();
console.log(process.env.PORT)

import * as fileUpload from 'express-fileupload';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    cors: true
  });
  // Body-parser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // FileUpload
  // app.use(fileUpload({ useTempFiles: true }));
  app.use(fileUpload());  

  // Cors
  app.use(cors({ origin: true, credentials: true }));
  await app.listen(process.env.PORT);
}
bootstrap();
