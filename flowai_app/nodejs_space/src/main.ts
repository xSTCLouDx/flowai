import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const swaggerPath = 'api-docs';

  // Prevent CDN/browser caching of Swagger docs
  app.use(`/${swaggerPath}`, (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('FlowAI API')
    .setDescription('FlowAI - AI-powered productivity app backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'FlowAI API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .information-container { margin: 30px 0; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .scheme-container { background: #fafafa; padding: 20px; border-radius: 4px; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
      .swagger-ui .opblock-tag { font-size: 18px; font-weight: 600; }
      .swagger-ui .opblock { border: 1px solid #e8e8e8; margin: 10px 0; }
      .swagger-ui .opblock .opblock-summary { padding: 10px; }
      .swagger-ui .btn { border-radius: 4px; }
      .swagger-ui .model-box { background: #fafafa; }
    `,
    customfavIcon: 'data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><text y=\".9em\" font-size=\"90\">📋</text></svg>',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/${swaggerPath}`);
}
bootstrap();
