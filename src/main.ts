import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from './common/config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  const port = config.port;

  app.enableCors();

  const configSwagger = new DocumentBuilder()
    .setTitle('Hyperlocal API')
    .setDescription('API for franchisee and customer management')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('user')
    .addTag('franchise')
    .addTag('product')
    .addTag('server')
    .addTag('customer')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  await app.listen(port).then(() => {
    logger.log(`Server is running on port ${port}`);
  });
}
bootstrap();
