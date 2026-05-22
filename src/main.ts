import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Define the ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Add Swagger settings
  const config = new DocumentBuilder()
    .setTitle('Bond Sports - Account Management API')
    .setDescription(
      'API for managing accounts, deposits, withdrawals, and statements.',
    )
    .setVersion('1.0')
    .addTag('accounts', 'Account creation and balance management')
    .addTag('transactions', 'Money movement and history')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // The documentation will be available at http://localhost:3000/api
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
