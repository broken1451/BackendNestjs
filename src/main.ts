import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
console.log(process.env.PORT)

import * as fileUpload from 'express-fileupload';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });
  // Body-parser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // FileUpload
  app.use(fileUpload({ useTempFiles: true }));

  // Cors
  app.use(cors({ origin: true, credentials: true }));
  await app.listen(process.env.PORT);
}
bootstrap();
