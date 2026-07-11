// Remove BG TW — main page
"use client"

import { useState } from "react"
import Link from "next/link"
import { Upload, Sparkles, Zap, Download, Palette, Layers, Check } from "lucide-react"

export default function HomePage() {
  const [imageUrl, setImageUrl] = useState("")
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ resultUrl: string; originalUrl: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [background, setBackground] = useState("transparent")
  const [color, setColor] = useState("#ffffff")

  async function handleRemove() {
    if (!imageUrl.trim()) {
      setError("請輸入圖片 URL")
      return
    }

    setProcessing(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          background,
          color: background === "color" ? color : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "處理失敗")

      setResult({
        originalUrl: data.image.originalUrl,
        resultUrl: data.image.resultUrl,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "處理失敗")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight">Remove BG TW</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-zinc-600 hover:text-zinc-900">定價</Link>
            <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900">登入</Link>
            <Link href="/register" className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90">
              免費試用
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            純繁中 · AI 自動去背 · NT$ 計價
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            一鍵 AI 去背
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              5 秒完成透明 PNG
            </span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            支援 JPG / PNG / WebP · 批次 50 張 · 對比 slider · 多格式下載
            <br />
            比 Remove.bg 便宜 31% · 純繁中 · NT$199/月起
          </p>
        </div>

        {/* 上傳區 */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-500" />
            貼上圖片 URL 開始去背
          </h2>

          <div className="space-y-4">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-xxx.jpg"
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />

            {/* 背景選項 */}
            <div>
              <label className="block text-sm font-medium mb-2">新背景</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "transparent", label: "透明", icon: "∅" },
                  { v: "white", label: "白底", icon: "⬜" },
                  { v: "black", label: "黑底", icon: "⬛" },
                  { v: "color", label: "自訂色", icon: "🎨" },
                ].map((b) => (
                  <button
                    key={b.v}
                    onClick={() => setBackground(b.v)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      background === b.v
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {b.icon} {b.label}
                  </button>
                ))}
                {background === "color" && (
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-10 rounded-lg border border-zinc-300"
                  />
                )}
              </div>
            </div>

            <button
              onClick={handleRemove}
              disabled={processing}
              className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  處理中（5 秒）…
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  開始去背
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg p-3">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* 結果對比 */}
        {result && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-500" />
              處理完成
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-500 mb-2">原圖</p>
                <img src={result.originalUrl} alt="原圖" className="w-full rounded-lg border border-zinc-200" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 mb-2">去背後 ({background})</p>
                <img src={result.resultUrl} alt="去背後" className="w-full rounded-lg border border-zinc-200" style={{ background: background === 'transparent' ? 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 20px 20px' : undefined }} />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <a href={result.resultUrl} download="removed-bg.png" className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 flex items-center gap-2">
                <Download className="w-4 h-4" />
                下載 PNG
              </a>
              <button className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">
                下載 JPG（白底）
              </button>
              <button className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">
                下載 WebP
              </button>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: Zap, title: "5 秒處理", desc: "RMBG-1.4 AI 模型" },
            { icon: Layers, title: "批次 50 張", desc: "Web Worker 進度條" },
            { icon: Palette, title: "新背景", desc: "白底 / 黑底 / 自訂色" },
            { icon: Download, title: "多格式", desc: "PNG / JPG / WebP / ZIP" },
          ].map((f, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <f.icon className="w-6 h-6 text-emerald-500 mb-3" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing 簡表 */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">NT$ 計價 · 比 Remove.bg 便宜 31%</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">Free 1 trial · Lite NT$199/月 · Pro NT$999/月 · Volume+ NT$2,499/月</p>
          <Link href="/pricing" className="inline-block px-6 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900">
            查看完整定價
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-zinc-500">
          © 2026 Remove BG TW · Sean Li · 純繁中 AI 去背
        </div>
      </footer>
    </main>
  )
}