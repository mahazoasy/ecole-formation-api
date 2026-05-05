import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as YAML from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API École de Formation')
    .setDescription('Gestion des étudiants, formateurs, cours et inscriptions')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./openapi.yaml', YAML.stringify(document));
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();