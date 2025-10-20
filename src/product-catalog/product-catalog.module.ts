import { Module } from '@nestjs/common';
import { CreateProductUseCase } from './application/usecase/create-product.usecase';
import { DeleteProductUseCase } from './application/usecase/delete-product.usecase';
import { ListProductsUseCase } from './application/usecase/list-products.usecase';
import { UpdateProductUseCase } from './application/usecase/update-product.usecase';
import { PRODUCT_REPOSITORY } from './domain/repository/product.repository';
import {
  PRODUCT_DOMAIN_SERVICE,
  ProductDomainServiceImpl,
} from './domain/service/product-domain.service';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { PrismaService } from '../shared/prisma/prisma.service';
import { ProductController } from './presentation/controller/product.controller';

@Module({
  controllers: [ProductController],
  providers: [
    PrismaService,
    PrismaProductRepository,
    { provide: PRODUCT_REPOSITORY, useExisting: PrismaProductRepository },
    ProductDomainServiceImpl,
    { provide: PRODUCT_DOMAIN_SERVICE, useExisting: ProductDomainServiceImpl },
    CreateProductUseCase,
    DeleteProductUseCase,
    UpdateProductUseCase,
    ListProductsUseCase,
  ],
})
export class ProductCatalogModule {}
