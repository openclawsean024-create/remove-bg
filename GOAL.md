# Goal — AI 去背 M1

> ⚠️ **建議封存，需 Sean 決定後才開發。** 理由見 `PRD/SPEC.md` §0：核心去背未運作、市場已商品化、程式使用的 RMBG-1.4 疑為非商用授權、「台灣最便宜／便宜 31%」無依據。以下 M1 僅在 Sean 決定不封存時適用。

## Objective

在不呼叫付費 API 正式環境、不接真實金流、只用測試圖片的前提下，把 repo 收斂成「安全、合法、可真正去背」的 PoC：品質閘門擋得住失敗、移除無依據的價格宣稱、驗證與資料權限正確、可上傳圖片並經由可替換的去背 adapter 產出透明 PNG、扣點正確。

規格依據：`PRD/SPEC.md` v4.0（§4 FR、§7 風險、§8 M1）。

## Acceptance criteria

每條 AC 的「驗證」指令必須 exit 0。

- **AC-001：品質閘門擋得住失敗**
  - 新增 `typecheck`（`tsc --noEmit`）與 `e2e`（Playwright）script；只保留 npm lockfile。
  - 測試改為 import 實際路由／模組，不再複製 schema。
  - CI 新增 typecheck、e2e job；deploy job 需所有 job 通過，且 PR 上不部署。
  - 驗證：`npm run lint && npm run typecheck && npm test && npm run build && npm run e2e` 全部 exit 0；`grep -nE "continue-on-error|\|\| echo" .github/workflows/ci.yml` 無結果；PR 上 GitHub Actions 全綠。

- **AC-002：移除無依據宣稱，記錄模型授權決定**（SPEC §7）
  - 頁面移除「比 Remove.bg 便宜 31%」等無出處比較字樣；新增 `PRD/MODEL-LICENSE.md`，記錄選用模型、授權條款連結、查證日期與 Sean／法務確認結果。
  - 程式不得再引用 RMBG-1.4 的 Replicate 版本，除非 `MODEL-LICENSE.md` 記載已取得商用授權。
  - 驗證：`git grep -nE "便宜 ?31%|最便宜" -- src` 無結果；`git grep -n "fb8af171cfa1616ddcf1242c093f9c3991acf9562ace5f7eafe2e5ab2b0d21f5" -- src` 無結果（或 `MODEL-LICENSE.md` 有商用授權紀錄）；`test -f PRD/MODEL-LICENSE.md`。

- **AC-003：可替換去背 adapter（測試不打付費 API）**（FR-001、FR-003）
  - 新增 `BackgroundRemover` 介面，含 `mock`（以固定遮罩產生透明 PNG）與一個正式實作（含非同步結果輪詢、逾時與錯誤處理）；由環境變數選擇，測試與 CI 一律用 mock。
  - 背景替換在伺服器或瀏覽器實際合成（透明／白／黑／自訂色），不再只加 URL 參數。
  - 驗證：`npm test -- tests/remover.test.ts tests/compose-background.test.ts`（mock 輸出 PNG 含 alpha 通道；輪詢逾時回錯誤碼；以 mock `fetch` 斷言 CI 中付費 API 呼叫次數為 0）。

- **AC-004：圖片上傳與隱私**（FR-002）
  - 首頁改為檔案上傳（JPG／PNG／WebP、≤ 10 MB），伺服器端驗證 MIME 與大小、移除 EXIF；處理結果以簽章 URL 讀取並設保存期限。
  - 測試圖片只用 repo 內自製的幾何圖形或明確可商用的圖片，不得有可辨識真人。
  - 驗證：`npm test -- tests/upload-validation.test.ts tests/exif-strip.test.ts`；`npm run e2e -- tests/e2e/upload-remove.spec.ts`（上傳 → 下載透明 PNG）。

- **AC-005：驗證、權限與扣點**（FR-004、FR-005、FR-006）
  - 統一使用 Supabase Auth（或單一自建 session），移除把使用者 UUID 直接當 cookie 的作法；`/api/remove` 需登入或匿名試用 token，並在同一交易內檢查與扣點，點數不足回 402。
  - migration 移除 `images_anon_read` 全域讀取政策，改為只能讀自己的紀錄；API 錯誤不回傳資料庫原始訊息。
  - 驗證：`npm test -- tests/auth-session.test.ts tests/credits.test.ts tests/rls-policy.test.ts`（後者靜態檢查 migration 不含 `USING (user_id IS NULL)` 的 SELECT 政策）；`npm run e2e -- tests/e2e/history.spec.ts`（登入後歷史頁可見自己的紀錄）。

## Out of scope

- 真實金流（Stripe 正式或測試帳號建立）、發票、訂閱。
- 在 CI 或測試中呼叫 Replicate 等付費 API；正式付費 API 呼叫。
- 真實使用者照片或個資；production 部署與 Vercel／Supabase 設定變更。
- 在地尺寸、批次、開發者 API（M2 之後）。
- 封存、刪除或改名 repo（由 Sean 決定）。

## Exit gate

- Sean 先書面決定「不封存」並確認模型授權方向，才可開始 M1。
- AC-001～AC-005 驗證指令全部 exit 0，記錄於 `STATUS.md`；實作 PR 的 GitHub Actions 全綠。
- 未取得可商用模型授權確認前，不得進入 M2 或對外收費。
