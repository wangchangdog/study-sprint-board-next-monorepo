# Copilot Instructions

## このリポジトリの設計思想

Study Sprint Board は、教育用の見本プロジェクトです。学生がチーム開発の進め方、設計判断の理由、運用の考え方を学べることを目的としています。

「動くコード」だけでなく「なぜそう設計したか」を伝えることが最優先です。

## モノレポ運用方針

- `pnpm` ワークスペースと Turborepo を使用
- アプリは `apps/` に、共通設定やライブラリは `packages/` に配置
- ルートの `package.json` から Turborepo 経由ですべてのタスクを実行
- パッケージ間の依存は `workspace:*` で管理

## コーディング方針

### 型安全を優先する

- TypeScript の strict mode を使用
- `any` を避ける。やむを得ない場合は理由をコメントで残す
- API のリクエスト・レスポンスには Zod スキーマを使う
- Prisma の型を活用し、手書きの型定義を最小限にする

### App Router の使い方

- Server Components を基本とする
- `"use client"` は状態管理、イベントハンドラ、ブラウザ API が必要な箇所にのみ使う
- データ取得は Server Component または Route Handler で行う

### DB アクセス

- Prisma を UI 層から直接呼ばない
- DB アクセスは `server/services/` に閉じ込める
- Route Handlers はバリデーションとサービス呼び出しのみ行う

### バリデーション

- Zod スキーマを `lib/validations.ts` に集約する
- Route Handler の入口で必ずバリデーションする
- バリデーションエラーは適切な HTTP ステータスとメッセージを返す

## ドキュメント方針

- コードを変更したら、対応する `docs/` のドキュメントも更新する
- docs と実装の不一致は教材として致命的なので避ける
- README.md はプロジェクトの入口。常に最新の状態を保つ
- API 仕様の正本は `docs/api/openapi.yaml` とし、`docs/api-spec.md` は補足資料として扱う
- TypeSpec を導入する場合でも、レビュー対象の成果物は OpenAPI を残す

## 変更の進め方

- 小さな差分で進める。1つの PR に複数の関心事を混ぜない
- コメントは「なぜ」を補うために使い、「何をしているか」の冗長な説明は避ける
- 変更後は必ず `pnpm lint && pnpm typecheck && pnpm test && pnpm build` を実行する
