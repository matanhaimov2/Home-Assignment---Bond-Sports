import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';

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

  // Add PrismaClientExceptionFilter to handle Prisma errors
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

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

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1); // Close the process with an error if something fails during startup
});
