import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const PORT = process.env.PORT!;
  await app.listen(PORT, () =>
    console.log(`Swagger UI on http://localhost:${PORT}/doc`)
  );
}

bootstrap();