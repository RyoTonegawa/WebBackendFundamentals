import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/product.entity';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  execute(input: CreateProductInput): Promise<Product> {
    return this.productRepository.create(input);
  }
}
