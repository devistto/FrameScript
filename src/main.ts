import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Video Captioner API')
    .setDescription(
      `Video Captioner is a self-hosted API designed to generate unlimited subtitled videos using high-precision speech recognition with Whisper.`
    )
    .setVersion('1.2')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(8000, () =>
    console.log(`Swagger UI on http://localhost:8000/doc`)
  );
}

bootstrap();