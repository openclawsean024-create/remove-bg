// Remove BG TW — /pricing
import Link from "next/link"
import { Check } from "lucide-react"

const TIERS = [
  { name: 'Free', price: 'NT$0', desc: '1 trial · 0.25 MP', features: ['未登入試用 1 次', '0.25 MP 低解析度'], highlight: false },
  { name: 'Pay-as-you-go', price: 'NT$96', desc: '3 credits 永久', features: ['3 credits 不過期', '全解析', 'JPG/PNG/WebP'], highlight: false },
  { name: 'Lite', price: 'NT$199/月', desc: '40 credits / 月', features: ['40 credits / 月', '批次上傳', 'API 串接', '歷史紀錄'], highlight: true },
  { name: 'Pro', price: 'NT$999/月', desc: '200 credits / 月', features: ['200 credits', '高優先序', 'Webhooks', '專業支援'], highlight: false },
  { name: 'Volume+', price: 'NT$2,499/月', desc: '500 credits / 月', features: ['500 credits', '團隊協作', 'SSO', '專屬客服'], highlight: false },
  { name: 'Student', price: 'NT$49/月', desc: '20 credits / 月', features: ['校園 Email 驗證', '20 credits', '教育版'], highlight: false },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
              R
            </div>
            <span className="font-semibold">Remove BG TW</span>
          </Link>
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">回首頁</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">NT$ 計價 · 比 Remove.bg 便宜 31%</h1>
          <p className="text-zinc-600 dark:text-zinc-400">從免費試用到企業議價，總有一個適合你</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl border p-6 ${
                t.highlight
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-transparent shadow-xl shadow-emerald-500/20'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <h3 className={`text-lg font-bold mb-1 ${t.highlight ? '' : 'text-zinc-900 dark:text-white'}`}>{t.name}</h3>
              <p className={`text-sm mb-4 ${t.highlight ? 'text-emerald-50' : 'text-zinc-500'}`}>{t.desc}</p>
              <div className="mb-6">
                <span className={`text-3xl font-bold ${t.highlight ? '' : 'text-zinc-900 dark:text-white'}`}>{t.price}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${t.highlight ? '' : 'text-emerald-500'}`} />
                    <span className={t.highlight ? '' : 'text-zinc-700 dark:text-zinc-300'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block w-full text-center py-2.5 rounded-lg font-medium text-sm transition ${
                  t.highlight ? 'bg-white text-emerald-600 hover:bg-emerald-50' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90'
                }`}
              >
                {t.name === 'Enterprise' ? '聯繫業務' : '開始使用'}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-zinc-500">
          企業方案議價：contact@removebg.tw · 14 天免費試用 Pro · 年繳 8 折
        </div>
      </div>
    </main>
  )
}