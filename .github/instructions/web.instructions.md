---
applyTo: "apps/web/**/*.ts,apps/web/**/*.tsx,apps/web/**/*.css"
---

# Web アプリケーション開発ガイド

## ディレクトリ構成を尊重する

- `app/` — ページルーティングと Route Handlers のみ
- `features/` — 機能単位のコンポーネント群
- `server/services/` — ビジネスロジック・DB アクセス
- `lib/` — 設定・ユーティリティ・バリデーション
- `components/` — 機能横断の汎用 UI コンポーネント

## Server Components と Client Components

- デフォルトは Server Component
- `"use client"` はフォーム入力、ステート管理、イベントハンドラが必要な箇所のみ
- Server Component で取得したデータを props として Client Component に渡すパターンを基本とする

## UI と server ロジックの責務分離

- Prisma を app/ や features/ から直接 import しない
- DB アクセスは必ず `server/services/` 経由
- Route Handlers は薄く保つ：バリデーション → サービス呼び出し → レスポンス

## Zod バリデーション

- 入力バリデーションは `lib/validations.ts` のスキーマを使用する
- 新しい API エンドポイントを追加する場合は、先にスキーマを定義する
- フロントエンドのフォームバリデーションにも同じスキーマを再利用する

## スタイリング

- Tailwind CSS のユーティリティクラスを使用する
- `globals.css` のカスタムプロパティ（CSS 変数）を活用する
- コンポーネント固有のスタイルは Tailwind クラスで表現する
