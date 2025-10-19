import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CreateProductUseCase } from './application/usecase/create-product.usecase';
import { DeleteProductUseCase } from './application/usecase/delete-product.usecase';
import { ListProductsUseCase } from './application/usecase/list-products.usecase';
import { UpdateProductUseCase } from './application/usecase/update-product.usecase';
import { PRODUCT_REPOSITORY } from './domain/product.repository';
import { PostgresService } from './infrastructure/database/postgres.service';
import { RequestLoggingMiddleware } from './infrastructure/middleware/request-logging.middleware';
import { PostgresProductRepository } from './infrastructure/repositories/postgres-product.repository';
import { ProductController } from './presentation/controller/product.controller';

@Module({
  controllers: [ProductController],
  providers: [
    PostgresService,
    PostgresProductRepository,
    { provide: PRODUCT_REPOSITORY, useExisting: PostgresProductRepository },
    CreateProductUseCase,
    DeleteProductUseCase,
    UpdateProductUseCase,
    ListProductsUseCase,
  ],
})
export class ECommerceModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
