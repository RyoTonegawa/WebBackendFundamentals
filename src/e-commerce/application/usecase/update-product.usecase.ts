import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/product.entity';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, input: UpdateProductInput): Promise<Product> {
    const updated = await this.productRepository.update(id, input);
    if (!updated) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    return updated;
  }
}
