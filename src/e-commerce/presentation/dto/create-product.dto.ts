import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: '商品名。購入者がカタログで確認する名称です。',
    example: 'プレミアムコーヒー豆',
  })
  name!: string;

  @ApiProperty({
    description: '商品の詳細説明。素材や特徴などを記載します。',
    example: 'ブラジル産アラビカ種を100%使用した深煎りブレンドです。',
  })
  description!: string;

  @ApiProperty({
    description: '税込価格（円）。小数点以下は使用しません。',
    example: 2980,
  })
  price!: number;

  @ApiProperty({
    description: '現在の在庫数。マイナス値は許可されません。',
    example: 120,
  })
  stock!: number;
}
