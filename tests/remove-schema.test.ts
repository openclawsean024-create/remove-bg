// Remove BG TW — v3.0.2 minimal unit test
// 測試 src/app/api/remove/route.ts 的 zod schema 驗證
import { describe, it, expect } from "vitest"
import { z } from "zod"

// 直接 mirror RemoveSchema（不 import route 避免觸發 side effect）
const RemoveSchema = z.object({
  image_url: z.string().url(),
  background: z.enum(['transparent', 'white', 'black', 'color', 'image']).default('transparent'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  image_id: z.string().uuid().optional(),
})

describe("remove — image_url zod validation", () => {
  it("合法 https 圖片 URL 應通過驗證", () => {
    const r = RemoveSchema.safeParse({
      image_url: "https://example.com/photo.jpg",
      background: "transparent",
    })
    expect(r.success).toBe(true)
  })

  it("非 URL 字串應被拒絕", () => {
    const r = RemoveSchema.safeParse({ image_url: "not-a-url" })
    expect(r.success).toBe(false)
  })

  it("缺少 image_url 應被拒絕", () => {
    const r = RemoveSchema.safeParse({ background: "white" })
    expect(r.success).toBe(false)
  })

  it("非法 background enum 應被拒絕", () => {
    const r = RemoveSchema.safeParse({
      image_url: "https://example.com/x.png",
      background: "rainbow",
    })
    expect(r.success).toBe(false)
  })

  it("color 格式 #RRGGBB 應通過驗證", () => {
    const r = RemoveSchema.safeParse({
      image_url: "https://example.com/x.png",
      background: "color",
      color: "#ff00aa",
    })
    expect(r.success).toBe(true)
  })

  it("color 格式錯誤（非 # 開頭）應被拒絕", () => {
    const r = RemoveSchema.safeParse({
      image_url: "https://example.com/x.png",
      background: "color",
      color: "ff00aa",
    })
    expect(r.success).toBe(false)
  })
})
