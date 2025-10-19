import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: '変更後の商品名。未指定の場合は現状維持となります。',
    example: 'プレミアムコーヒー豆（限定焙煎）',
  })
  name?: string;

  @ApiPropertyOptional({
    description: '変更後の詳細説明。商品リニューアル時などに利用します。',
    example: '限定焙煎による香りを強調したシングルオリジンです。',
  })
  description?: string;

  @ApiPropertyOptional({
    description: '変更後の税込価格（円）。未指定の場合は現状価格を維持します。',
    example: 3200,
  })
  price?: number;

  @ApiPropertyOptional({
    description: '変更後の在庫数。未指定の場合は現状の在庫数を利用します。',
    example: 80,
  })
  stock?: number;
}
