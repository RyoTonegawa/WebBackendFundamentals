import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entity/product.entity';
import { PRODUCT_REPOSITORY } from '../repository/product.repository';
import type { ProductRepository } from '../repository/product.repository';
import { PRODUCT_ID_NOT_FOUND } from '../constants/message';

export interface CreateProductCommand {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductCommand {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export interface ProductDomainService {
  createProduct(command: CreateProductCommand): Promise<Product>;
  listProducts(): Promise<Product[]>;
  updateProduct(id: string, command: UpdateProductCommand): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}

export const PRODUCT_DOMAIN_SERVICE = Symbol('PRODUCT_DOMAIN_SERVICE');

@Injectable()
export class ProductDomainServiceImpl implements ProductDomainService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  createProduct(command: CreateProductCommand): Promise<Product> {
    return this.productRepository.create(command);
  }

  listProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async updateProduct(
    id: string,
    command: UpdateProductCommand,
  ): Promise<Product> {
    const updated = await this.productRepository.update(id, command);
    if (!updated) {
      throw new NotFoundException(`${PRODUCT_ID_NOT_FOUND} id:${id}`);
    }
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`${PRODUCT_ID_NOT_FOUND} id:${id}`);
    }
  }
}
