# AI 去背 — 開發與驗證 SOP

## 規格對齊狀態（2026-11-16）

- ✅ `PRD/SPEC.md` v4.0 依 `main`（`9f33c69`）程式重建；`GOAL.md` 定義 M1。
- ⚠️ 評估建議**封存**；Sean 決定前不開發。
- ⚠️ 本機無法執行 node：下表所有指令**未在本機執行**，結果欄只引用 GitHub Actions 紀錄。

## 環境

```bash
npm ci        # 使用 package-lock.json；repo 另有 pnpm-lock.yaml
```

需要的環境變數（只列名稱，值不得進 repo）：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`、`REPLICATE_API_TOKEN`（選用；未設時為 mock，直接回原圖）。

## 驗證指令（依 `package.json` scripts 查證）

| 類型 | 指令 | 狀態 | 最近證據 |
|---|---|---|---|
| Install | `npm ci` | 可用 | CI 2026-09-06 成功 |
| Lint | `npm run lint`（`eslint`） | 可用 | CI lint ✓ |
| Typecheck | — | **尚未配置** | 無 script |
| Unit test | `npm test`（`vitest run`） | 可用 | CI ✓；只有 6 個 schema 測試，未 import 路由 |
| Build | `npm run build` | 可用 | CI ✓ |
| E2E | — | **尚未配置** | — |
| Format | — | **尚未配置** | — |

## CI 現況

- lint／test／build 不吞錯；deploy job 用 `amondnet/vercel-action` 部署 production，2026-09-06 run `34028024060` 的 deploy 失敗。
- 沒有 typecheck 與 e2e；本次文件 PR 不改 CI。

## 若重啟 M1 的流程

1. 取得 Sean 書面「不封存」決定與模型授權方向。
2. 先做 AC-001、AC-002，再做 adapter、上傳、驗證與扣點。
3. 把指令與 exit code 記到 `STATUS.md`。

## 故意不做

- ❌ 真實金流、付費 API 正式呼叫、真人照片、production 部署。
