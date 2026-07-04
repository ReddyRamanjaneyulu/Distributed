import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
  );

  // CORS — allow the Vite dev server to call this API with credentials
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Distributed Job Scheduler API')
    .setDescription(
      'REST API for Distributed Job Scheduler',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup(
    'api',
    app,
    document,
  );

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);

  console.log(
    `🚀 Server running on http://localhost:${port}`,
  );

  console.log(
    `📚 Swagger UI: http://localhost:${port}/api`,
  );
}

bootstrap();