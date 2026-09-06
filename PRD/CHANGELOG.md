# Changelog

All notable changes to this project will be documented in this file.

> v3.0.2 完成於 2026-09-06 by Sean 10-repo-fleet

---

## v3.0.2 — 2026-09-06 — Sean 10-repo-fleet

### Fleet Alignment
- **§0 Banner**：補上 v3.0.2 Fleet Alignment Banner，維護者換成 Sean 10-repo-fleet，對齊 SPEC v3.0 契約
- **§16 In-Scope 與 v1 範圍明確化**：新增 — 把 v3.0 sweet-spot rewrite 的隱含範圍寫成 16.1 In-Scope（5 種在地場景 + Replicate rmbg-1.4 + 5 種背景 + 5 種 plan + Supabase Auth + 5 tables + Credit 計費 + 在地尺寸 profile）+ 16.2 Out-of-Scope（視訊/AI 修圖/字型/品牌設計/多語系/原生 App）
- **§17 監控與可觀測性**：新增 — Replicate API + Supabase + Stripe + 8 個關鍵 KPI（含圖片處理成功率 / p95 latency / churn rate）+ 告警規則
- **§18 維運與升級 SOP**：新增 — Preview/Production 雙環境 + 模型升級 SOP（Replicate rmbg-1.4 → 下一代 A/B test）+ Rollback
- **§19 安全與合規**：新增 — OWASP Top 10 對照 + Secret 管理 + 圖片隱私（Replicate 不永久儲存 + EXIF GPS 移除 + signed URL）+ PDPA 對齊
- **GHA workflow**：新增 `.github/workflows/ci.yml` — 4-job CI（lint/test/build/deploy-to-vercel）
- **ESLint 9 flat config**：新增 `eslint.config.mjs`
- **Vitest 測試基礎**：新增 `vitest.config.ts` + `tests/auth.test.ts`（3 個 vitest 測試）

### 對齊 v3.0
- v3.0 §1–§15 完整 702 行規格書（Sweet Spot 5.5/10 rewrite + §15 深度市調 + §11 市場驗證 + §12 失敗模式 SOP + §13 MetaGPT/spec-kit 對齊 + §7 風險表 + §9 變現路徑）已完備，**本輪不動**。
- 全部 5 API + 5 Supabase tables + Replicate rmbg-1.4 + Vercel Production 上線 = production code 完整度不變。
- v3.0.2 = 純 fleet alignment：補 §0 + §16-19 + ESLint 9 + vitest + GHA workflow。

### 已知 issue（升級週處理）
- `npm audit` 顯示若干 high vulnerability（多為 Stripe 17.x transitive deps）— 待 2026-09 升級週跑 `npm audit fix` 評估。
- ESLint 9 flat config + Replicate API mock 模式（v1 demo 用）— 待正式 model 上線後切換。
- 圖片 EXIF GPS 移除 + signed URL — v2 規劃。

---

## v3.0 — 2026-07-19 — Sophia (CPO) for Sean

### Sweet-Spot Rewrite（從 v2.2.1 「Remove.bg 中文克隆」轉向 v3.0「台灣在地尺寸工具」）
- **§15 深度市調報告**：Sweet Spot 5 問分析（Q1 6/10, Q2 6/10, Q3 5/10, Q4 4/10, Q5 6/10 = 加權 5.5/10）
- **Pivot 觸發條件**：6 個月付費 < 50 → 降價或轉 freemium + 廣告
- **§11 市場驗證計畫**：3 個關鍵問題 + 訪談 SOP + 5 個具體訪談目標 + 1 篇社群文 + 1 個 Landing Page Test
- **§12 失敗模式 SOP**：付費轉換率 < 2% / 範本庫成本過高 / Remove.bg 直接優化蝦皮尺寸 / 餐飲業付費意願低
- **§13 MetaGPT / spec-kit 對齊**：MetaGPT 對齊（PRD/SPEC/DoD/RFC）+ spec-kit 對齊 + 開發規範
- **§7 風險與決策**：5 個風險 + ADR-001（從「Remove.bg 中文克隆」轉向「台灣在地尺寸工具」5 步論證）+ ADR-002（為何用 rembg 而非 Remove.bg API）
- **§6 DoD v1 MVP**：6 個 P0 功能 + 5 種在地尺寸 + 50 個繁中範本 + Vitest 70% + Vercel + Fly.io + 30 位 beta
- **§9 變現路徑 + 定價心理學**：NT$199/月 / NT$299/月 / NT$499/堂 / 企業版
- **§4 系統設計**：5 種 plan（free / payg / lite / pro / volume_plus）+ 5 種在地尺寸（LINE 370×320 + 蝦皮 1024×1024 + Momo + 菜單）

### Status
- PRD 規格分數（新）：9.0
- 商業化分數（新）：(9.0 × 0.3 + 5.5 × 0.7) × 10 = 65.5 ≈ 66
- Live: https://remove-bg-blue-nine.vercel.app ⭐ Vercel Production
- Source: https://github.com/openclawsean024-create/remove-bg
- Sprint 1 完成：home/4 子頁（dashboard / login / pricing / register）+ 5 API（auth login/register + images + remove）+ 5 Supabase tables + Replicate rmbg-1.4 整合

---

## v2.2.1 — 2026-07-11 — Sophia (CPO) + Alan (CTO)

### Added
- §1-13 完整功能規格 + 競品 quadrant chart + 12 個 Error Code + 訪談 SOP
- 5 種變現引擎（個人 + 訂閱 + 企業 + 標案 + 顧問）
- DoD 8 條完成標準

### Status
- v2.2.1 為「Remove.bg 中文克隆」定位（後被 sweet spot 體檢判定紅海，於 v3.0 改向）

---

## v2 — 2026-07-11 — Sophia (CPO)

### Added
- **§15 深度市調報告**：v1 補完，奠基於市場研究。

---

## v1 — 2026-07-08 — Alan (CTO)

### Added
- **Sprint 1 純前端 prototype**：Next.js 16 + React 19 + Tailwind 4 + Replicate rmbg-1.4 mock
- **首頁 + 上傳 + 去背 + Auth + 5 tables + Vercel 部署**

### Notes
- v1 定位為「Remove.bg 中文克隆」（後被判定紅海，v3.0 改向）
- v1 → v2.2.1 → v3.0 三輪迭代，每次都補 §15 深度市調
