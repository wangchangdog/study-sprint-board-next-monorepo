# ロードマップ

## 現在の状態（MVP）

- [x] モノレポ構成（pnpm + Turborepo）
- [x] Next.js 15 App Router
- [x] Prisma + PostgreSQL（Docker）
- [x] 認証（NextAuth.js v5 / Credentials Provider）
- [x] タスク CRUD（作成・一覧・詳細・編集）
- [x] コメント機能
- [x] ダッシュボード
- [x] 管理画面（ユーザー一覧）
- [x] Zod バリデーション
- [x] Vitest ユニットテスト
- [x] Playwright E2E テスト（スタブ）
- [x] ESLint + Prettier
- [x] GitHub Actions CI
- [x] Copilot instructions / agents

## 次にやるべきこと（Phase 2）

- [ ] コメント投稿フォーム（Client Component）の実装
- [ ] タスク一覧のフィルタ・ソート UI
- [ ] ページネーション
- [ ] タスク削除機能
- [ ] レスポンシブデザインの強化
- [ ] エラーバウンダリ・ローディング UI の追加

## 中期（Phase 3）

- [ ] OAuth 認証（GitHub Provider）の追加
- [ ] ラベル管理画面（CRUD）
- [ ] タスク検索機能
- [ ] 通知機能（タスク割当時）
- [ ] テストカバレッジの拡充
- [ ] E2E テストの本格実装

## 長期（Phase 4）

- [ ] `apps/api` への API 分離
- [ ] `packages/ui` デザインシステムの構築
- [ ] リアルタイム更新（WebSocket / SSE）
- [ ] ファイル添付機能
- [ ] アクティビティログ
- [ ] ダッシュボードのグラフ化
- [ ] PWA 対応
- [ ] 多言語対応（i18n）
- [ ] デプロイ自動化（Vercel / Render）

## 教材としての改善

- [ ] コンポーネントのストーリーブック化
- [ ] ADR（Architecture Decision Records）の追加
- [ ] パフォーマンス計測・最適化ガイド
- [ ] セキュリティチェックリスト
- [ ] 運用マニュアル
