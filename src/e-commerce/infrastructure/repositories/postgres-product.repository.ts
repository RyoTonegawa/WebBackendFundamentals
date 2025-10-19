import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { Product } from '../../domain/product.entity';
import { ProductRepository } from '../../domain/product.repository';
import { PostgresService } from '../database/postgres.service';

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class PostgresProductRepository implements ProductRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async findAll(): Promise<Product[]> {
    const { rows } = await this.postgresService
      .client
      .query<ProductRow>('SELECT * FROM products ORDER BY created_at DESC');
    return rows.map(this.mapRowToDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const { rows } = await this.postgresService
      .client
      .query<ProductRow>('SELECT * FROM products WHERE id = $1', [id]);
    return rows[0] ? this.mapRowToDomain(rows[0]) : null;
  }

  async create(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    const now = new Date();
    const entity: Product = {
      ...product,
      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
    };

    await this.postgresService.client.query(
      `INSERT INTO products (id, name, description, price, stock, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        entity.id,
        entity.name,
        entity.description,
        entity.price,
        entity.stock,
        entity.createdAt.toISOString(),
        entity.updatedAt.toISOString(),
      ],
    );

    return entity;
  }

  async update(
    id: string,
    product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Product | null> {
    const sanitizedPatch = this.removeUndefined(product);
    if (Object.keys(sanitizedPatch).length === 0) {
      const existing = await this.findById(id);
      return existing;
    }

    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const updated: Product = {
      ...existing,
      ...sanitizedPatch,
      updatedAt: new Date(),
    };

    await this.postgresService.client.query(
      `UPDATE products
         SET name = $2,
             description = $3,
             price = $4,
             stock = $5,
             updated_at = $6
       WHERE id = $1`,
      [
        updated.id,
        updated.name,
        updated.description,
        updated.price,
        updated.stock,
        updated.updatedAt.toISOString(),
      ],
    );

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await this.postgresService.client.query(
      'DELETE FROM products WHERE id = $1',
      [id],
    );
    return (rowCount ?? 0) > 0;
  }

  private mapRowToDomain(row: ProductRow): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      stock: Number(row.stock),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private removeUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
    return Object.entries(value).reduce<Partial<T>>((acc, [key, item]) => {
      if (item !== undefined) {
        acc[key as keyof T] = item as T[keyof T];
      }
      return acc;
    }, {});
  }
}
