# セットアップ手順

## 必要な環境

- Node.js 20 以上
- pnpm 9 以上
- Docker（PostgreSQL 用）
- Git

## 手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd study-sprint-board-next-monorepo
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` ファイルを開き、必要に応じて値を変更してください。デフォルト値のままでも開発環境では動作します。

### 3. 依存パッケージのインストール

```bash
pnpm install
```

### 4. PostgreSQL の起動

```bash
docker compose up -d
```

### 5. データベースのセットアップ

```bash
# Prisma クライアントの生成
pnpm db:generate

# マイグレーションの実行
pnpm db:push

# シードデータの投入
pnpm db:seed
```

### 6. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで http://localhost:3000 を開いてください。

### 開発用アカウント

| 名前 | メールアドレス | パスワード | 権限 |
|------|---------------|-----------|------|
| 管理者 太郎 | admin@example.com | password123 | ADMIN |
| 開発 花子 | user1@example.com | password123 | USER |
| テスト 次郎 | user2@example.com | password123 | USER |

## 開発コマンド

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | 本番ビルド |
| `pnpm lint` | ESLint 実行 |
| `pnpm typecheck` | TypeScript 型チェック |
| `pnpm test` | Vitest テスト実行 |
| `pnpm format` | Prettier でフォーマット |
| `pnpm db:studio` | Prisma Studio 起動（DB GUI） |
| `pnpm db:migrate` | マイグレーション作成・実行 |
| `pnpm db:seed` | シードデータ投入 |

## トラブルシューティング

### PostgreSQL に接続できない

```bash
# Docker コンテナの状態を確認
docker compose ps

# コンテナを再起動
docker compose down && docker compose up -d
```

### Prisma のエラー

```bash
# クライアントを再生成
pnpm db:generate

# データベースをリセット
pnpm --filter web exec prisma db push --force-reset
pnpm db:seed
```
