import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entity/product.entity';
import {
  PRODUCT_DOMAIN_SERVICE,
  type CreateProductCommand,
  type ProductDomainService,
} from '../../domain/service/product-domain.service';

export type CreateProductInput = CreateProductCommand;

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_DOMAIN_SERVICE)
    private readonly productDomainService: ProductDomainService,
  ) {}

  execute(input: CreateProductInput): Promise<Product> {
    return this.productDomainService.createProduct(input);
  }
}
