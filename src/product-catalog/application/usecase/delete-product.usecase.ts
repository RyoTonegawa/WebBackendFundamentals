import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_DOMAIN_SERVICE,
  type ProductDomainService,
} from '../../domain/service/product-domain.service';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_DOMAIN_SERVICE)
    private readonly productDomainService: ProductDomainService,
  ) {}

  execute(id: string): Promise<void> {
    return this.productDomainService.deleteProduct(id);
  }
}
