import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Product } from '../../domain/product.entity';
import { ProductRepository } from '../../domain/product.repository';

@Injectable()
export class InMemoryProductRepository implements ProductRepository {
  private readonly products = new Map<string, Product>();

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }

  async create(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    const now = new Date();
    const created: Product = {
      ...product,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.products.set(created.id, created);
    return created;
  }

  async update(
    id: string,
    product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Product | null> {
    const existing = this.products.get(id);
    if (!existing) {
      return null;
    }

    const updated: Product = {
      ...existing,
      ...product,
      updatedAt: new Date(),
    };

    this.products.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}
