# ShigyoFlow プロジェクト情報

## プロジェクト概要
士業（弁理士・弁護士など）向けの案件管理ツール

## 技術スタック
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **開発環境**: Node.js + npm

## プロジェクト構成

```
shigyoflow/
├── app/
│   ├── clients/
│   │   └── page.tsx        # 顧客一覧画面
│   ├── cases/
│   │   └── page.tsx        # 案件ボード画面
│   ├── page.tsx            # トップページ
│   └── layout.tsx
├── public/
├── package.json
└── CLAUDE.md              # このファイル
```

## 実装済み機能

### 顧客一覧画面 (`/clients`)
- ✅ 顧客カードの表示
- ✅ 詳細モーダル（表示/編集モード切り替え）
- ✅ 新規顧客追加
- ✅ 顧客情報編集
- ✅ 顧客削除（確認ダイアログ付き）
- ✅ 保存成功メッセージ（3秒後に自動非表示）

**データ構造:**
```typescript
type Client = {
  company: string;    // 会社名
  contact: string;    // 担当者
  address: string;    // 住所
  email: string;      // メール（一意キー）
  phone: string;      // 電話番号
};
```

### 案件ボード画面 (`/cases`)
- ✅ カンバン方式のUI（4列レイアウト）
- ✅ ステータスごとの案件表示
- ✅ 動的な件数表示
- ✅ 新規案件追加
- ✅ 案件の詳細表示・編集・削除（モーダル）
- ✅ ドラッグ&ドロップでステータス変更
- ✅ 保存/移動成功メッセージ（3秒後に自動非表示）

**ステータス:**
- `pending` - 未着手
- `in_progress` - 対応中
- `awaiting_client` - 顧客確認待ち
- `completed` - 完了

**データ構造:**
```typescript
type Case = {
  id: string;        // 案件ID
  title: string;     // 案件名
  client: string;    // 顧客名
  status: string;    // ステータス
};
```

**ドラッグ&ドロップ機能:**
- 案件カードをドラッグして別のステータス列にドロップ
- ドロップ先の列が青くハイライト表示
- ドラッグ中のカードは半透明表示
- ステータス変更後に成功メッセージ表示

## 重要な実装パターン

### 状態管理（useState）
```typescript
const [data, setData] = useState<Type>(initialValue);
```
- コンポーネントのトップレベルに配置
- 関数内では `set` のみ使用

### 配列操作

**map（変換）:**
```typescript
array.map(item => 変換後のitem)
// 要素数は変わらない、各要素を変換
```

**filter（絞り込み）:**
```typescript
array.filter(item => 条件)
// 条件に合う要素だけ残す
```

**追加:**
```typescript
setArray([...array, newItem])
```

**更新:**
```typescript
setArray(array.map(item => 
  item.id === targetId ? updatedItem : item
))
```

**削除:**
```typescript
setArray(array.filter(item => item.id !== targetId))
```

### スプレッド構文（イミュータブル更新）
```typescript
setObject({ ...object, field: newValue })
// 新しいオブジェクトを作成（元は変更しない）
```

### ドラッグ&ドロップの実装パターン
```typescript
// ドラッグ開始
const handleDragStart = (e: React.DragEvent, item: Type) => {
  setDraggedItem(item);
  e.dataTransfer.effectAllowed = 'move';
};

// ドラッグオーバー
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

// ドロップ
const handleDrop = (e: React.DragEvent, newStatus: string) => {
  e.preventDefault();
  // ステータス更新処理
};
```

## 学習の記録

### 習得した概念
- ✅ useState の使い方とルール
- ✅ 条件付きレンダリング
- ✅ map/filter による配列操作
- ✅ スプレッド構文とイミュータブル
- ✅ モーダルの実装パターン
- ✅ フォーム制御
- ✅ CRUD操作の基本
- ✅ HTML5 ドラッグ&ドロップAPI
- ✅ イベントハンドラー（onDragStart, onDragOver, onDrop）

### 次のステップ候補
- [ ] 検索・フィルター機能
- [ ] データの永続化（localStorage/API）
- [ ] 案件と顧客の連携強化
- [ ] 期限・優先度の管理
- [ ] ダッシュボード（統計表示）

## 開発サーバー起動方法

```bash
npm run dev
```

アクセス先:
- トップ: http://localhost:3001/
- 顧客一覧: http://localhost:3001/clients
- 案件ボード: http://localhost:3001/cases

## メモ

### よくあるエラーと解決方法

**1. useState を関数内に書いてしまう**
```typescript
❌ const handleClick = () => {
  const [state, setState] = useState(false);
}

✅ const [state, setState] = useState(false);
  const handleClick = () => {
    setState(true);
  }
```

**2. 配列/オブジェクトを直接変更**
```typescript
❌ array[0] = newValue;
   setArray(array);

✅ setArray(array.map((item, i) => 
     i === 0 ? newValue : item
   ));
```

**3. スペルミス（address）**
- `address` は `d` が2つ（よく間違える）

**4. ドラッグ&ドロップ時の注意点**
- `onDragOver` で必ず `e.preventDefault()` を呼ぶ
- ドロップを有効にするために必須

## 開発履歴

### 2025年12月6日（午前）
- ✅ 案件ボード画面に詳細表示・編集・削除機能を追加
- ✅ ドラッグ&ドロップによるステータス変更機能を実装
- ✅ 視覚的フィードバック（ドロップ先のハイライト、ドラッグ中の半透明表示）
- ✅ 移動成功メッセージの表示

---

