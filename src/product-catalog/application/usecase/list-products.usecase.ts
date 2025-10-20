import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entity/product.entity';
import {
  PRODUCT_DOMAIN_SERVICE,
  type ProductDomainService,
} from '../../domain/service/product-domain.service';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_DOMAIN_SERVICE)
    private readonly productDomainService: ProductDomainService,
  ) {}

  execute(): Promise<Product[]> {
    return this.productDomainService.listProducts();
  }
}
