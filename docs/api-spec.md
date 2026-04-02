# API 仕様

このファイルは **人間向けの補足説明** です。

機械可読な正本は `docs/api/openapi.yaml` を参照してください。

この標準見本では、提出・レビュー・引き継ぎで扱う API 仕様書を `OpenAPI` としています。`TypeSpec` は将来の発展課題として、OpenAPI を生成するための記述元に採用できます。

## 共通仕様

- **認証**: すべてのエンドポイントは認証済みユーザーのみアクセス可能
- **レスポンス形式**: JSON
- **エラーレスポンス**: `{ "error": "メッセージ", "details": { ... } }`

## エンドポイント一覧

### GET /api/tasks

タスク一覧を取得する。

**クエリパラメータ:**

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| status | string | フィルタ: TODO, IN_PROGRESS, IN_REVIEW, DONE |
| priority | string | フィルタ: LOW, MEDIUM, HIGH, URGENT |
| assigneeId | string | フィルタ: 担当者ID |

**レスポンス:** `200 OK`

```json
[
  {
    "id": "clu...",
    "title": "タスクのタイトル",
    "description": "説明",
    "status": "TODO",
    "priority": "MEDIUM",
    "dueDate": "2026-04-20T00:00:00.000Z",
    "assignee": { "id": "...", "name": "...", "email": "..." },
    "createdBy": { "id": "...", "name": "..." },
    "taskLabels": [{ "label": { "id": "...", "name": "...", "color": "..." } }],
    "_count": { "comments": 3 },
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### POST /api/tasks

タスクを新規作成する。

**リクエストボディ:**

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| title | string | ✅ | タイトル（1-200文字） |
| description | string | | 説明（最大2000文字） |
| status | string | | ステータス（デフォルト: TODO） |
| priority | string | | 優先度（デフォルト: MEDIUM） |
| dueDate | string | | 締切日（ISO 8601形式） |
| assigneeId | string | | 担当者ID |
| labelIds | string[] | | ラベルIDの配列 |

**レスポンス:** `201 Created`

---

### GET /api/tasks/:id

タスク詳細を取得する。コメント一覧を含む。

**レスポンス:** `200 OK` / `404 Not Found`

---

### PATCH /api/tasks/:id

タスクを更新する。部分更新に対応。

**リクエストボディ:** POST と同じフィールド（すべてオプション）

**レスポンス:** `200 OK` / `400 Bad Request` / `404 Not Found`

---

### POST /api/tasks/:id/comments

タスクにコメントを投稿する。

**リクエストボディ:**

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| content | string | ✅ | コメント内容（1-2000文字） |

**レスポンス:** `201 Created` / `404 Not Found`

```json
{
  "id": "clu...",
  "content": "コメント内容",
  "author": { "id": "...", "name": "..." },
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### GET /api/dashboard/summary

ダッシュボード用のサマリーデータを取得する。

**レスポンス:** `200 OK`

```json
{
  "myTaskCount": 5,
  "statusCounts": {
    "TODO": 3,
    "IN_PROGRESS": 2,
    "IN_REVIEW": 1,
    "DONE": 6
  },
  "upcomingTasks": [...],
  "recentTasks": [...]
}
```
