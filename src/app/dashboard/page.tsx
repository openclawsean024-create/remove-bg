// Remove BG TW — /dashboard
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, Upload, Clock, CreditCard, Image as ImageIcon } from "lucide-react"

interface ImageRecord {
  id: string
  original_url: string
  result_url: string | null
  background: string
  format: string
  status: string
  credits_charged: number
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [images, setImages] = useState<ImageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/images")
      .then(async (r) => {
        if (!r.ok) {
          if (r.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("載入失敗")
        }
        return r.json()
      })
      .then((d) => {
        if (d) setImages(d.images || [])
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [router])

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Remove BG TW</span>
          </Link>
          <Link href="/" className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            新增去背
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">歷史紀錄</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
          所有你的去背處理紀錄
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 text-sm rounded-lg p-3 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-zinc-500">載入中…</div>
        ) : images.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <ImageIcon className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 mb-4">還沒有任何處理紀錄</p>
            <Link href="/" className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium">
              開始第一張去背
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img) => (
              <div key={img.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center" style={{ background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 20px 20px' }}>
                  {img.result_url ? (
                    <img src={img.result_url} alt="去背" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-zinc-400 text-sm">處理中</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                    <Clock className="w-3 h-3" />
                    {new Date(img.created_at).toLocaleString('zh-TW')}
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      img.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      img.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {img.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <CreditCard className="w-3 h-3" />
                    {img.credits_charged} credit · {img.background} · {img.format}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}