# ER 図

## エンティティ関連図

```
┌──────────────────┐       ┌──────────────────┐
│      User        │       │      Label       │
├──────────────────┤       ├──────────────────┤
│ id          PK   │       │ id          PK   │
│ name             │       │ name        UQ   │
│ email       UQ   │       │ color            │
│ password_hash    │       └────────┬─────────┘
│ role             │                │
│ image            │                │
│ created_at       │       ┌────────┴─────────┐
│ updated_at       │       │    TaskLabel      │
└───┬──────────┬───┘       ├──────────────────┤
    │          │           │ task_id   PK,FK  │
    │          │           │ label_id  PK,FK  │
    │ assignee │ createdBy └──────────────────┘
    │          │                    ▲
    ▼          ▼                    │
┌──────────────────┐               │
│      Task        │───────────────┘
├──────────────────┤
│ id          PK   │
│ title            │
│ description      │
│ status           │  enum: TODO, IN_PROGRESS, IN_REVIEW, DONE
│ priority         │  enum: LOW, MEDIUM, HIGH, URGENT
│ due_date         │
│ assignee_id FK   │──→ User.id
│ created_by_id FK │──→ User.id
│ created_at       │
│ updated_at       │
└───────┬──────────┘
        │
        │ 1:N
        ▼
┌──────────────────┐
│    Comment       │
├──────────────────┤
│ id          PK   │
│ content          │
│ task_id     FK   │──→ Task.id (CASCADE DELETE)
│ author_id   FK   │──→ User.id
│ created_at       │
│ updated_at       │
└──────────────────┘
```

## NextAuth.js 補助テーブル

```
Account         Session         VerificationToken
├── id PK       ├── id PK       ├── identifier
├── user_id FK  ├── session_token UQ  ├── token UQ
├── type        ├── user_id FK  └── expires
├── provider    └── expires
└── ...
```

## リレーション一覧

| From | To | 関係 | 説明 |
|------|----|------|------|
| Task.assignee_id | User.id | N:1 | タスクの担当者 |
| Task.created_by_id | User.id | N:1 | タスクの作成者 |
| Comment.task_id | Task.id | N:1 | コメントが属するタスク（CASCADE DELETE） |
| Comment.author_id | User.id | N:1 | コメントの投稿者 |
| TaskLabel.task_id | Task.id | N:1 | タスクとラベルの多対多中間テーブル |
| TaskLabel.label_id | Label.id | N:1 | タスクとラベルの多対多中間テーブル |

## Enum 定義

### Role
- `USER` — 一般ユーザー
- `ADMIN` — 管理者

### TaskStatus
- `TODO` — 未着手
- `IN_PROGRESS` — 進行中
- `IN_REVIEW` — レビュー中
- `DONE` — 完了

### Priority
- `LOW` — 低
- `MEDIUM` — 中
- `HIGH` — 高
- `URGENT` — 緊急
