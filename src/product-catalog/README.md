# Product Catalog モジュール

商品カタログ領域のユースケースをまとめたモジュール。各レイヤの役割は以下の通りです。

## domain
- `entity` … `Product` などドメインで扱う構造体。
- `repository` … 永続化の契約 (`ProductRepository`) と DI トークンの定義。
- `service` … ドメインロジックの集約 (`ProductDomainService`)。ユースケース層はここから操作する。
- `constants` … ドメイン固有の定数やメッセージ。

## application
- `usecase` … HTTP 層に公開するアプリケーションサービス。ドメインサービスへ委譲することでドメインルールを再利用する。

## presentation
- `controller` … REST API エンドポイント。Swagger デコレーターで自動ドキュメント化。
- `dto` … 入出力 DTO。クライアントとの契約を明示化する。

## infrastructure
- `repositories/prisma-product.repository.ts` … Prisma を利用して `ProductRepository` を実装。永続化の詳細をここに閉じ込める。

## DI 構成
- `product-catalog.module.ts` でモジュール全体の依存関係を束ねる。
  - `PrismaProductRepository` を `PRODUCT_REPOSITORY` トークンに束縛。
  - `ProductDomainServiceImpl` を `PRODUCT_DOMAIN_SERVICE` として公開。
  - 上記をユースケースとコントローラが利用する。

Prisma のスキーマは `prisma/schema.prisma` に配置し、`src/shared/prisma/prisma.service.ts` 経由で `PrismaProductRepository` から利用します。
