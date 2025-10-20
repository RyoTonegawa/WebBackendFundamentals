import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entity/product.entity';
import {
  PRODUCT_DOMAIN_SERVICE,
  type ProductDomainService,
  type UpdateProductCommand,
} from '../../domain/service/product-domain.service';

export type UpdateProductInput = UpdateProductCommand;

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_DOMAIN_SERVICE)
    private readonly productDomainService: ProductDomainService,
  ) {}

  execute(id: string, input: UpdateProductInput): Promise<Product> {
    return this.productDomainService.updateProduct(id, input);
  }
}
