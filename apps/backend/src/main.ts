import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { SocketService } from './socket/socket.service';
import { backendConfig as config } from 'config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  const socketService = app.get(SocketService);
  const port = config.port;

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: true,
  });

  app.use(cookieParser());

  if (config.swagger.enable) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API Document')
      .setDescription('API Document Description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(config.swagger.prefixPath, app, swaggerDocument);
  }

  await prismaService.enableShutdownHooks(app);
  await socketService.initializeSocketChannel();
  await app.listen(port);
}
bootstrap();
