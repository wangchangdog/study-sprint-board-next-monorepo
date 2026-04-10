# AGENTS.md

## このリポジトリについて

このリポジトリは `Study Sprint Board` の **Next.js App Router 一体型見本** です。`apps/web` の中に UI、Route Handlers、サービス層、Prisma を同居させ、1 つのアプリでフルスタック構成を読めるようにしています。

- 主な変更対象は `apps/web`
- `packages/` は共通設定と将来拡張用の共有パッケージ
- 兄弟 repo の SPA/API 構成や Supabase 構成として説明しない
- `team-dev-curriculum/` は参照対象であり、この repo の通常作業では編集しない

## まず確認するファイル

| 目的 | ファイル |
| --- | --- |
| 全体像 | `README.md`, `docs/architecture.md` |
| セットアップ / 環境変数 | `docs/setup.md`, `apps/web/lib/monorepo-env.ts` |
| API 契約 | `docs/api/openapi.yaml`, `docs/api-spec.md` |
| 領域別の詳細ルール | `.github/instructions/web.instructions.md`, `.github/instructions/docs.instructions.md`, `.github/instructions/ci.instructions.md` |

## 実行コマンド

| 目的 | コマンド |
| --- | --- |
| 開発サーバー | `pnpm dev` |
| lint | `pnpm lint` |
| typecheck | `pnpm typecheck` |
| テスト一式 | `pnpm test` |
| 単体テスト 1 ファイル | `pnpm --filter web test -- tests/unit/validations.test.ts` |
| build | `pnpm build` |
| E2E 一式 | `pnpm --filter web test:e2e` |
| E2E 1 ファイル | `pnpm --filter web test:e2e -- tests/e2e/signin.spec.ts` |
| Prisma Client 再生成 | `pnpm db:generate` |

## 高レベルアーキテクチャ

- ルートは `pnpm` ワークスペース + `turbo` で、実アプリは `apps/web` に集約しています。
- リクエストの主な流れは `app/` の Server Components / Route Handlers → `server/services/` → Prisma → PostgreSQL です。
- `app/` はルーティングと Route Handlers、`features/` は機能単位 UI、`components/` は汎用 UI、`lib/` は設定とバリデーションに寄せます。
- `apps/web/lib/monorepo-env.ts` が、アプリ配下に `.env` がない場合は repo ルートの環境変数を読む前提を作っています。テストや Playwright もこの前提で動きます。

| 正本 | 役割 |
| --- | --- |
| `docs/api/openapi.yaml` | HTTP 契約の正本 |
| `apps/web/prisma/schema.prisma` | 永続化モデルの正本 |
| `docs/api-spec.md` | API 説明の補足資料 |
| `docs/architecture.md` | 教材としてのレイヤー説明 |

## この repo で重要な約束

- Server Components を基本にし、`"use client"` は状態管理・イベント・ブラウザ API が必要な箇所に限定します。
- Prisma を `app/` や `features/` から直接 import せず、DB アクセスは `server/services/` に閉じ込めます。
- 入力検証は `lib/validations.ts` の Zod スキーマを再利用し、Route Handler とフォームで意味をずらしません。
- API や DB の挙動を変えるときは、実装だけでなく `README.md` と `docs/` の説明も同時に合わせます。
- 教材 repo なので、過度な抽象化より「どこに何の責務があるか」を追いやすい構造を優先します。
