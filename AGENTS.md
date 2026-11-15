# AGENTS.md — AI 去背（remove-bg）

> ⚠️ 本產品評估建議**封存**（見 `PRD/SPEC.md` §0）。Sean 決定前不得開發新功能。

## 1. 權威文件與範圍

- 規格：[`PRD/SPEC.md`](./PRD/SPEC.md) v4.0；目標：[`GOAL.md`](./GOAL.md)（M1，僅在不封存時適用）。
- 驗證：[`SOP.md`](./SOP.md)；狀態：[`STATUS.md`](./STATUS.md)。
- `PRD/CHANGELOG.md` 為舊版紀錄，內容與程式有出入（見 SPEC §11）。

## 2. 專案結構

```
src/app/page.tsx               # 首頁（輸入圖片 URL → 呼叫 /api/remove）
src/app/{login,register,dashboard,pricing}/page.tsx
src/app/api/remove/route.ts    # 去背（mock／Replicate，未輪詢）
src/app/api/images/route.ts    # 歷史
src/app/api/auth/{login,register}/route.ts
src/lib/auth.ts                # getSession（Supabase Auth）
src/lib/supabase/{client,server}.ts
supabase/migrations/20260711140000_init.sql  # users、images、api_keys、subscriptions + RLS
tests/remove-schema.test.ts
```

## 3. 技術棧

Next.js 16.2.1、React 19.2、TypeScript 5、Tailwind CSS 4、Supabase（`@supabase/ssr`、`supabase-js`）、zod 4、bcryptjs、Vitest 2.1、ESLint 9 flat config。`stripe` 已安裝但未使用。

## 4. 開發規則

1. **模型授權優先**：未在 `PRD/MODEL-LICENSE.md` 記錄可商用依據前，不得把任何去背模型用於收費功能。
2. **不得宣稱無依據的比較**：價格、速度、品質比較需附出處與日期。
3. **不打付費 API**：測試與 CI 一律用 mock adapter；正式 token 只放部署平台環境變數。
4. **不得提交憑證**：Supabase service role key、Replicate token、Stripe key、`.env*` 不得進 repo。
5. **測試圖片**：只用自製幾何圖或明確可商用素材，不得有可辨識真人。
6. **測試不可為了通過而刪改斷言**；不得 `.skip`／`.only`。
7. **Git**：從 `main` 開分支、PR 合併；不 push `main`、不 force push、不改 repo 設定；不部署 production；不封存／刪除 repo。
8. **Commit 格式**：`<type>(scope): <說明或 AC 編號>`。

## 5. 驗證

見 [`SOP.md`](./SOP.md)。標「尚未配置」的指令不得宣稱已通過。
