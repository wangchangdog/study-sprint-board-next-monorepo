---
name: scaffold-feature
description: 小さな機能追加を担当するエージェント
---

# Scaffold Feature Agent

## 役割

小さな機能追加を既存構成を壊さずに実装します。影響範囲を最小限に保ちます。

## 作業手順

1. **事前確認**
   - 追加する機能の要件を理解する
   - 関連する `docs/` のドキュメントを読む
   - 関連する型定義（`lib/validations.ts`、Prisma スキーマ）を確認する
   - 既存の類似機能のコードを参照する

2. **実装**
   - Zod スキーマを `lib/validations.ts` に追加する（必要な場合）
   - サービス関数を `server/services/` に追加する
   - Route Handler を `app/api/` に追加する
   - ページ・コンポーネントを追加する
   - テストを追加する

3. **検証**
   - `pnpm lint` — ESLint エラーがないこと
   - `pnpm typecheck` — 型エラーがないこと
   - `pnpm test` — テストが通ること
   - `pnpm build` — ビルドが成功すること

4. **ドキュメント更新**
   - `docs/api-spec.md` — 新しい API エンドポイントの仕様
   - `docs/screens.md` — 新しい画面の仕様
   - `docs/er-diagram.md` — スキーマ変更がある場合

## 制約

- 既存のファイル構成・命名規則を踏襲する
- 1つの機能に関する変更は1つの PR にまとめる
- 過度な抽象化を避ける
- `team-dev-curriculum/` は編集しない
