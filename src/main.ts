import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { TOKEN_HEADER_KEY } from './common/constants';
import { TypeORMExceptionFilter } from './common/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setAppUse(app);
  // swagger
  const options = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', in: 'header', name: TOKEN_HEADER_KEY },
      TOKEN_HEADER_KEY,
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
  console.log(`✅ swagger ready at http://localhost:3000/api`);
}

bootstrap();

export function setAppUse(app) {
  app.use(json({}));
  app.use(urlencoded({ extended: true }));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new TypeORMExceptionFilter());
}
