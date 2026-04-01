---
applyTo: ".github/workflows/**/*.yml,.github/workflows/**/*.yaml"
---

# CI ワークフロー作成ガイド

## 基本方針

- 初学者が読める、シンプルな記述にする
- 無駄に複雑な matrix は避ける
- 実行順序: install → lint → typecheck → test → build

## ジョブ構成

- 1つのワークフローで基本検証を網羅する
- ジョブを分割する場合は依存関係を明示する（`needs:`）

## キャッシュ

- pnpm store のキャッシュは使用してよい
- 過剰なキャッシュ戦略は避ける（メンテナンスコストが上がる）
- キャッシュキーには lockfile のハッシュを含める

## 環境変数

- シークレットは GitHub Secrets を使用する
- CI 用の環境変数は workflow 内で定義する

## 注意点

- CI が落ちている状態でマージしない
- テストが不安定な場合はスキップではなく修正する
