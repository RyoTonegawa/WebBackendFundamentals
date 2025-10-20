# アーキテクチャ概要

この NestJS プロジェクトでは、商品カタログ領域を中心としたモジュラ・アーキテクチャを採用しており、レイヤと依存関係を明確に分離しています。

## ルート構成

- `src/root.module.ts`
  - アプリケーション全体を束ねるルートモジュールです。
  - 読み込むサブモジュール (`ProductCatalogModule` など) を一箇所にまとめることで、依存関係を見渡しやすくしています。
- `src/main.ts`
  - Nest アプリケーションのエントリポイント。
  - ルートモジュールを bootstrap し、Swagger 初期化などアプリ全体の設定を記述します。

RootModule を src 配下に明示的に置くことで、モジュール間の依存関係が「このファイルを見れば分かる」構成になり、後からモジュールを追加・差し替えするときの影響範囲も把握しやすくなります。

## Product Catalog ドメイン

- ディレクトリ: `src/product-catalog`
- 目的: 商品カタログ（商品情報の管理）に関するユースケースを提供

### レイヤ構造

- `domain`
  - `entity`: ドメインエンティティ (`Product` など)
  - `repository`: レポジトリ契約と DI トークン (`PRODUCT_REPOSITORY`)
  - `service`: ドメインサービス。ユースケースからドメインロジックを呼び出すための境界 (`PRODUCT_DOMAIN_SERVICE`)
  - `constants`: エラーメッセージなどのドメイン定数
- `application`
  - `usecase`: ユースケース層。コントローラから呼ばれ、ドメインサービスを利用して操作を実行します。
- `presentation`
  - `controller`: HTTP API を提供するコントローラ
  - `dto`: リクエスト/レスポンス DTO と Swagger 用メタデータ
- `infrastructure`
  - `repositories`: Prisma を使って永続化層を実装するアダプタ
  - ※ DB 接続設定自体は共有モジュール (`src/shared/prisma`) にまとめています

### 依存関係

```
Presentation -> Application -> Domain -> Infrastructure (実装)
```

- Application 層はドメインサービス（インターフェイス）に依存し、ドメインサービスがレポジトリを利用することで、ドメインロジックをインフラ詳細から切り離しています。
- Infrastructure 層はドメインのインターフェイスを実装し、Module で `useExisting`/`useClass` を介して DI コンテナに登録。
- これによりインフラ実装を差し替えてもアプリケーションやドメイン層のコードを変更せずに済む構造です。

## ロギングとミドルウェア

- `RequestLoggingMiddleware`
  - `uuidv7` による一貫したリクエスト ID を付与し、Winston で構造化ログに出力。
  - `main.ts` でグローバル適用しており、今後追加されるモジュールにも自動的に適用されます。

## データベース

- PostgreSQL を想定し、Prisma (ORM) 経由でアクセスします。
- `.env` の `DATABASE_URL` を通じて接続設定が可能。
- Prisma のスキーマは `prisma/schema.prisma` に定義し、`src/shared/prisma/prisma.service.ts` で Nest の DI に組み込んでいます。

## 今後の拡張に向けて

- 新しいドメイン（例: 注文管理や配送など）を追加する場合は、`src` 配下にモジュールを追加し、`RootModule` で import するのが推奨です。
- 各モジュールが `domain/application/presentation/infrastructure` を持つ構成にしておくと、モジュール間の依存が明確になり、モジュラモノリスからマイクロサービスへの移行も行いやすくなります。

以上が本プロジェクトの基本構成と依存関係の整理です。
