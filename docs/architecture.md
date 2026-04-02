# アーキテクチャ

## 概要

Study Sprint Board は **Next.js App Router** を中核としたフルスタックモノレポ構成です。

## 構成図

```
ブラウザ
  │
  ▼
Next.js (App Router)
  ├── Server Components（データ取得・表示）
  ├── Client Components（ユーザー操作）
  ├── Route Handlers（REST API）
  └── Middleware（認証制御）
        │
        ▼
    サービス層 (server/services/)
        │
        ▼
    Prisma ORM
        │
        ▼
    PostgreSQL
```

## レイヤー構成

| レイヤー | 責務 | 配置 |
|----------|------|------|
| UI 層 | 画面表示・ユーザー操作 | `app/`, `components/`, `features/` |
| API 層 | HTTP エンドポイント | `app/api/` (Route Handlers) |
| サービス層 | ビジネスロジック・DB アクセス | `server/services/` |
| データ層 | スキーマ定義・マイグレーション | `prisma/` |

## 設計原則

### Server Components を基本にする

App Router では、コンポーネントはデフォルトで Server Component として動作します。ブラウザに JavaScript を送る必要がないため、パフォーマンスが向上します。`"use client"` は、状態管理やイベントハンドラが必要な箇所にのみ付与します。

### DB アクセスを server 側に閉じ込める

Prisma を直接 UI コンポーネントから呼び出しません。DB アクセスは `server/services/` 内のサービス関数に閉じ込め、Route Handlers や Server Components から呼び出します。

**理由**: 将来 `apps/api` として独立した API サーバーに切り出す際、サービス層をそのまま移植できる構造にするためです。

### 機能単位でディレクトリを分ける

`features/` ディレクトリ配下に、機能（auth, tasks, comments, dashboard）ごとにコンポーネントやロジックをまとめます。`app/` 配下にはルーティングに必要なページコンポーネントのみを置き、ドメイン知識を散らしません。

### バリデーションを統一する

リクエストのバリデーションは Zod スキーマで一元管理します（`lib/validations.ts`）。API Route Handler で入力を検証し、型安全なデータをサービス層に渡します。

### API 仕様は OpenAPI を正本にする

この見本では、API の機械可読仕様を `docs/api/openapi.yaml` で管理します。`docs/api-spec.md` は授業用の補足資料であり、仕様の正本ではありません。

#### なぜ機械可読な API 仕様書が必要か

チーム開発で API を使うとき、仕様書がないと次の問題が起きます。

1. **「どちらが正しいか」が分からない** — フロントエンドとバックエンドで実装がずれたとき、仕様書がなければどちらのコードが正しいか判断する根拠がない
2. **文章だけでは曖昧さが残る** — Markdown に「ステータスを文字列で送る」と書いても、具体的にどの値が許されるかは読み手の解釈に委ねられる。機械可読な仕様なら enum で厳密に定義できる
3. **ツールで自動化できる** — OpenAPI があれば、モックサーバー生成、クライアントコード生成、リクエスト/レスポンスの自動バリデーションに使える。手作業による確認ミスが減る
4. **レビューが客観的になる** — 「仕様どおりに実装されているか」を、仕様書と実装の突き合わせで判定できる。主観に頼らないレビューが可能になる
5. **引き継ぎ・メンバー交代に耐える** — 口頭説明やチャットログに依存せず、新メンバーが仕様書を読めば API の全体像を把握できる

#### なぜ OpenAPI を選んだか

OpenAPI は実務での普及率が高く、共有・レビュー・クライアント生成・将来の API 分離に使いやすいためです。TypeSpec は有力な選択肢ですが、標準見本では学習負荷を抑えるため必須にしていません。発展課題として、TypeSpec を記述元にして OpenAPI を生成する構成に拡張できます。

## モノレポ構成

```
study-sprint-board-next-monorepo/
├── apps/web/          # Next.js アプリ本体
├── packages/
│   ├── config-eslint/     # ESLint 共通設定
│   ├── config-typescript/ # TypeScript 共通設定
│   ├── ui/                # 共通 UI（将来拡張用）
│   └── shared/            # 共通型・ユーティリティ（将来拡張用）
└── docs/              # プロジェクトドキュメント
```

**Turborepo** でビルドパイプラインを管理し、`pnpm` ワークスペースでパッケージ間の依存関係を解決します。

## 技術選定理由

| 技術 | 選定理由 |
|------|----------|
| Next.js 15 (App Router) | SSR/SSG 対応、Route Handlers で API を一体化、Vercel との親和性 |
| TypeScript | 型安全による開発体験の向上。チーム開発での齟齬を防ぐ |
| pnpm | ディスク効率、ワークスペース対応、高速インストール |
| Prisma | 型安全な ORM。スキーマファースト設計で DB とコードの整合性を保つ |
| PostgreSQL | SQL の知識が実務に直結。Supabase 等との互換性 |
| Tailwind CSS | ゼロランタイム。クラス名ベースで学習コストが低い |
| NextAuth.js v5 | App Router ネイティブ対応。Credentials + OAuth の柔軟な認証 |
| Zod | ランタイム型検証。TypeScript の型と連動 |
| Vitest | Vite ベースの高速テストランナー。Jest 互換 API |
| Playwright | クロスブラウザ E2E テスト。CI 環境での安定性 |

## 将来の拡張

- `apps/api`: 独立した API サーバー（Express/Hono）への分離
- `packages/ui`: デザインシステムの構築
- `packages/shared`: 型定義やバリデーションスキーマの共有
