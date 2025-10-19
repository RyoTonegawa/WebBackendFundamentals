import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ECommerceModule } from './e-commerce/e-commerce';

async function bootstrap() {
  const app = await NestFactory.create(ECommerceModule);

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
