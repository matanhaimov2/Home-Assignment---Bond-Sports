import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Define global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove fields that are not defined in the DTO
      forbidNonWhitelisted: true, // Return an error if non-whitelisted fields are sent
      transform: true, // Transform the input to the types defined in the DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
