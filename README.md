# Study Sprint Board

チームで学習や制作タスクを管理する Web アプリケーションです。

## 🎓 カリキュラム見本としての位置づけ

このリポジトリは、4年制専門学校の卒業制作カリキュラムにおける **標準構成の見本** です。Next.js App Router を中核としたフルスタックモノレポ構成で、以下を学べるように設計しています。

- **設計判断の理由** — なぜこの技術・構成を選んだのか
- **責務分離** — UI、API、ビジネスロジック、データ層の分け方
- **GitHub Flow** — Issue 駆動開発、PR レビュー、CI/CD
- **運用・拡張** — 将来の変更に備えた構造

## 採用技術

| カテゴリ | 技術 | 選定理由 |
|---------|------|----------|
| フレームワーク | Next.js 15 (App Router) | SSR/API 一体型。Vercel との親和性 |
| 言語 | TypeScript | 型安全。チーム開発での齟齬を防ぐ |
| パッケージ管理 | pnpm + Turborepo | ワークスペース対応。高速ビルド |
| UI | Tailwind CSS | ゼロランタイム。学習コスト低 |
| ORM | Prisma | 型安全。スキーマファースト |
| DB | PostgreSQL (Docker) | SQL 知識が実務に直結 |
| 認証 | NextAuth.js v5 (Auth.js) | App Router ネイティブ対応 |
| バリデーション | Zod | ランタイム型検証。TypeScript 連動 |
| テスト | Vitest + Testing Library | 高速テストランナー。Jest 互換 |
| E2E | Playwright | クロスブラウザ E2E テスト |
| Lint/Format | ESLint + Prettier | コードスタイル統一 |
| CI | GitHub Actions | PR ごとの自動品質チェック |

## セットアップ

### 必要な環境

- Node.js 20+
- pnpm 9+
- Docker

### 手順

```bash
# 1. 環境変数を準備
cp .env.example .env

# 2. 依存パッケージをインストール
pnpm install

# 3. PostgreSQL を起動
docker compose up -d

# 4. DB セットアップ
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. 開発サーバー起動
pnpm dev
```

http://localhost:3000 にアクセスしてください。

### 開発用アカウント

| メールアドレス | パスワード | 権限 |
|---------------|-----------|------|
| admin@example.com | password123 | ADMIN |
| user1@example.com | password123 | USER |
| user2@example.com | password123 | USER |

## 開発コマンド

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | 本番ビルド |
| `pnpm lint` | ESLint 実行 |
| `pnpm typecheck` | TypeScript 型チェック |
| `pnpm test` | テスト実行 |
| `pnpm format` | Prettier フォーマット |
| `pnpm db:studio` | Prisma Studio（DB GUI） |
| `pnpm db:seed` | シードデータ投入 |

## ディレクトリ構成

```
study-sprint-board-next-monorepo/
├── apps/web/                  # Next.js アプリ本体
│   ├── app/                   # ページルーティング・API
│   │   ├── (app)/             # 認証済みページ群
│   │   ├── signin/            # サインインページ
│   │   └── api/               # Route Handlers
│   ├── features/              # 機能単位コンポーネント
│   ├── server/services/       # ビジネスロジック・DB アクセス
│   ├── lib/                   # 設定・ユーティリティ
│   ├── prisma/                # スキーマ・シード・マイグレーション
│   └── tests/                 # テスト
├── packages/
│   ├── config-eslint/         # ESLint 共通設定
│   ├── config-typescript/     # TypeScript 共通設定
│   ├── ui/                    # 共通 UI（将来拡張）
│   └── shared/                # 共通ユーティリティ（将来拡張）
├── docs/                      # プロジェクトドキュメント
└── .github/                   # CI・テンプレート・Copilot 設定
```

## 設計思想

### レイヤー分離

```
UI 層 (app/, features/, components/)
  ↓ fetch / props
API 層 (app/api/ — Route Handlers)
  ↓ 関数呼び出し
サービス層 (server/services/)
  ↓ Prisma Client
データ層 (PostgreSQL)
```

- **Server Components を基本** にし、必要箇所だけ Client Components を使う
- **Prisma を UI 層から直接触らせない** — DB アクセスはサービス層に閉じ込める
- **Zod でバリデーションを統一** — API の入口で必ず検証する
- **将来の分離を意識** — `apps/api` への外出しが容易な構造

### なぜモノレポか

- 設定（ESLint, TypeScript）を一元管理できる
- 将来 `apps/api` や `apps/admin` を追加しやすい
- `packages/` で共通コードを共有できる

## 今後の拡張

詳細は [docs/roadmap.md](docs/roadmap.md) を参照してください。

- コメント投稿フォームの実装
- フィルタ・ソート・ページネーション
- OAuth 認証（GitHub Provider）
- ラベル管理画面
- `apps/api` への API 分離
- デザインシステムの構築

## Copilot Instructions / Agents

このリポジトリには、GitHub Copilot の活用を支援するファイルが含まれています。

| ファイル | 役割 |
|---------|------|
| `AGENTS.md` | リポジトリ全体の説明。Copilot がコンテキストを把握するため |
| `.github/copilot-instructions.md` | リポジトリ全体の開発方針 |
| `.github/instructions/web.instructions.md` | Web アプリのコーディングガイド |
| `.github/instructions/docs.instructions.md` | ドキュメント作成ガイド |
| `.github/instructions/ci.instructions.md` | CI ワークフロー作成ガイド |
| `.github/agents/scaffold-feature.agent.md` | 機能追加用カスタムエージェント |
| `.github/agents/review-sample.agent.md` | 教材品質レビュー用カスタムエージェント |

## ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [architecture.md](docs/architecture.md) | アーキテクチャ概要・設計原則 |
| [screens.md](docs/screens.md) | 画面一覧・画面遷移 |
| [er-diagram.md](docs/er-diagram.md) | ER 図・データモデル |
| [api-spec.md](docs/api-spec.md) | API エンドポイント仕様 |
| [setup.md](docs/setup.md) | 詳細セットアップ手順 |
| [roadmap.md](docs/roadmap.md) | 今後のロードマップ |

## ライセンス

教育目的で作成されたサンプルリポジトリです。
