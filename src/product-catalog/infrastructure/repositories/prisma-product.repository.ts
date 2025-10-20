import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entity/product.entity';
import { ProductRepository } from '../../domain/repository/product.repository';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(this.mapToDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const row = await this.prisma.product.findUnique({ where: { id } });
    return row ? this.mapToDomain(row) : null;
  }

  async create(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    const created = await this.prisma.product.create({
      data: {
        ...product,
        id: uuidv7(),
      },
    });
    return this.mapToDomain(created);
  }

  async update(
    id: string,
    product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Product | null> {
    const sanitized = this.removeUndefined(product);
    if (Object.keys(sanitized).length === 0) {
      const existing = await this.findById(id);
      return existing;
    }

    try {
      const updated = await this.prisma.product.update({
        where: { id },
        data: {
          ...sanitized,
        },
      });
      return this.mapToDomain(updated);
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.product.delete({ where: { id } });
      return true;
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return false;
      }
      throw error;
    }
  }

  private mapToDomain(row: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      stock: row.stock,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
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

  private isNotFoundError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2025'
    );
  }
}
