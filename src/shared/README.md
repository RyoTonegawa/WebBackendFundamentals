# /sharedの意味

全てのモジュール(API)に共通して設定する内容を配置する
ここに実装する内容は基本的にmain.tsで設定し、**個別のAPIで設定する運用の手間を省き確実に適用**させる。
逆にmain.tsへの設定を漏らすと全てのAPIに適用できなくなるため、
テストでそこをカバーする。

- `middleware/request-logging.middleware.ts`
  - リクエスト/レスポンス双方の構造化ログを記録し、`main.ts` でグローバル適用する。
- `prisma/prisma.service.ts`
  - Prisma Client を Nest の DI に載せるラッパー。各ドメインモジュールから共通利用する。
