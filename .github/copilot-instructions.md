# Copilot Instructions

## この repo の前提

この repo は `Study Sprint Board` の **Next.js App Router 一体型見本** です。SPA/API 分離構成でも Supabase 構成でもありません。`apps/web` に UI・Route Handlers・サービス層・Prisma を集約し、フルスタック構成を 1 つのアプリで読めるようにしています。

## 実行コマンド

| 目的 | コマンド |
| --- | --- |
| lint | `pnpm lint` |
| typecheck | `pnpm typecheck` |
| テスト一式 | `pnpm test` |
| 単体テスト 1 ファイル | `pnpm --filter web test -- tests/unit/validations.test.ts` |
| build | `pnpm build` |
| E2E 一式 | `pnpm --filter web test:e2e` |
| E2E 1 ファイル | `pnpm --filter web test:e2e -- tests/e2e/signin.spec.ts` |

## 高レベルアーキテクチャ

- ルートは `pnpm-workspace.yaml` と `turbo.json` で管理し、アプリ本体は `apps/web` にあります。
- `app/` の Server Components / Route Handlers が入口になり、業務ルールは `server/services/`、永続化は Prisma + PostgreSQL に寄せています。
- `features/` は機能単位 UI、`components/` は汎用 UI、`lib/` は設定・ユーティリティ・Zod バリデーションです。
- API の人間向け説明は `docs/api-spec.md` にありますが、通信契約の正本は `docs/api/openapi.yaml` です。
- `apps/web/lib/monorepo-env.ts` により、テストや Playwright を含めて repo ルートの `.env` を使う前提があります。

## 重要な規約

- Server Components を基本にし、`"use client"` は必要最小限にとどめます。
- Prisma を UI から直接触らず、DB アクセスは `server/services/` 経由にします。
- 入力検証は `lib/validations.ts` の Zod スキーマを基点にして、Route Handler とフォームの意味を揃えます。
- `docs/api/openapi.yaml` と `apps/web/prisma/schema.prisma` を、それぞれ通信契約と永続化契約の正本として扱います。
- 振る舞いを変える変更では、`README.md` と `docs/` も同時に更新します。
