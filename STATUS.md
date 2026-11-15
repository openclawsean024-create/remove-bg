# Status — remove-bg（AI 去背）

- 主 repo：`openclawsean024-create/remove-bg`（`main` @ `9f33c69`）
- 規格：`PRD/SPEC.md` v4.0；目標：`GOAL.md`（M1，僅在不封存時適用）
- 狀態：🔴 **文件重建完成；評估建議封存，待 Sean 決定**（2026-11-16）
- §0：完成度 15；獲利潛力 低

## 目前狀態摘要

- 去背 API 實際回傳原圖（無 token 時 mock；有 token 時未輪詢 Replicate）；背景替換只加 URL 參數。
- 只能貼圖片 URL，不能上傳；無扣點、無金流。
- 登入 cookie 存使用者 UUID，與 `getSession()` 使用的 Supabase Auth 不一致，歷史頁無法取得資料。
- RLS 允許任何人讀取所有匿名紀錄。
- 「台灣最便宜」「比 Remove.bg 便宜 31%」無依據；程式註解所用 RMBG-1.4 疑為非商用授權（待法務確認）。

## FR 對照（全部在 remove-bg）

| FR | 需求 | 優先 | 狀態 |
|---|---|---|---|
| FR-001 | AI 去背 | P0 | 未實作 |
| FR-002 | 圖片上傳 | P0 | 未實作 |
| FR-003 | 背景替換 | P0 | 未實作 |
| FR-004 | 註冊／登入 | P0 | 部分（有安全問題） |
| FR-005 | 點數與扣點 | P0 | 未實作 |
| FR-006 | 處理歷史 | P1 | 部分 |
| FR-007 | 定價頁 | P1 | 部分 |
| FR-008 | 金流 | P1 | 未實作 |
| FR-009 | 在地尺寸 | P1 | 未實作 |
| FR-010 | 批次 | P2 | 未實作 |
| FR-011 | 開發者 API | P2 | 未實作 |

## Deterministic checks

本次未在本機執行（環境無 node）。最近 CI：2026-09-06 run `34028024060` — lint／test／build ✓，deploy ✗。

## 本次變更

- 改寫 `PRD/SPEC.md`；新增 `GOAL.md`、`AGENTS.md`、`SOP.md`、`STATUS.md`；未動程式、設定、測試與 `PRD/CHANGELOG.md`。

## 待決事項

1. 是否封存（不刪除），或改為其他產品內建功能。
2. 模型授權方向（取得 BRIA 商用授權或改用可商用模型）。
3. 無依據的價格宣稱何時移除；舊部署 URL 與 Supabase 資料如何處理。
