import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../domain/product.entity';

export class ProductResponseDto {
  @ApiProperty({
    description: 'システムが採番する商品ID（UUID）。',
    example: '9d6f6aa0-6c02-4d6a-9df9-3f08482a1d42',
  })
  id!: string;

  @ApiProperty({
    description: '商品名。',
    example: 'プレミアムコーヒー豆',
  })
  name!: string;

  @ApiProperty({
    description: '商品の詳細説明。',
    example: 'ブラジル産アラビカ種を100%使用した深煎りブレンドです。',
  })
  description!: string;

  @ApiProperty({
    description: '税込価格（円）。',
    example: 2980,
  })
  price!: number;

  @ApiProperty({
    description: '現在の在庫数。',
    example: 120,
  })
  stock!: number;

  @ApiProperty({
    description: '商品が登録された日時。ISO 8601 形式の文字列で返却されます。',
    example: '2025-01-01T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    description: '商品情報が最後に更新された日時。ISO 8601 形式の文字列で返却されます。',
    example: '2025-01-10T18:30:45.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt!: Date;

  static fromDomain(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
