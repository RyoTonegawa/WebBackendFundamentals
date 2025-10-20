import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestLoggingMiddleware } from './shared/middleware/request-logging.middleware';
import { RootModule } from './root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  const requestLoggingMiddleware = new RequestLoggingMiddleware();
  app.use(requestLoggingMiddleware.use.bind(requestLoggingMiddleware));

  const config = new DocumentBuilder()
    .setTitle('E-Commerce 商品API')
    .setDescription('E-Commerce サイト向け商品管理APIの仕様書です。各エンドポイントの利用方法を確認できます。')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      displayRequestDuration: true,
    },
    customSiteTitle: 'E-Commerce API ドキュメント',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
