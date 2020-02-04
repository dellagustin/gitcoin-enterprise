import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as path from 'path';

export const pathToStaticAssets = path.join(__dirname, '../docs');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors('*'));
  // app.use(compression())


  (app as any).useStaticAssets(pathToStaticAssets);
  await app.listen(3000);
}
bootstrap();
