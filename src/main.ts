import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('DrivenPass API')
    .setDescription(
      'DrivenPass is a secure password manager for protecting your online accounts. ' +
      'Easily store and manage complex passwords, ensuring your online security. ' +
      'This API provides the backend functionality for the DrivenPass application.'
    )
    .setVersion('1.0')
    .addTag('drivenpass','password manager')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
