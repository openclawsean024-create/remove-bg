// Remove BG TW — POST /api/auth/login
import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { createServiceClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const attempts = new Map<string, { count: number; lockUntil: number }>()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ code: 'VALIDATION_FAILED', message: '資料驗證失敗' }, { status: 400 })
    }

    const { email, password } = parsed.data
    const a = attempts.get(email)
    if (a && a.lockUntil > Date.now()) {
      return NextResponse.json({ code: 'AUTH_LOCKED', message: '帳號鎖定中' }, { status: 429 })
    }

    const supabase = createServiceClient()
    const { data: user } = await supabase.from('users').select('*').eq('email', email).single()

    if (!user || !user.password_hash) {
      const c = (a?.count || 0) + 1
      attempts.set(email, { count: c, lockUntil: c >= 5 ? Date.now() + 15 * 60 * 1000 : 0 })
      return NextResponse.json({ code: 'AUTH_INVALID', message: 'Email 或密碼錯誤' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      const c = (a?.count || 0) + 1
      attempts.set(email, { count: c, lockUntil: c >= 5 ? Date.now() + 15 * 60 * 1000 : 0 })
      return NextResponse.json({ code: 'AUTH_INVALID', message: 'Email 或密碼錯誤' }, { status: 401 })
    }

    attempts.delete(email)
    const cookieStore = await cookies()
    cookieStore.set('rb_session', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600,
      path: '/',
    })

    return NextResponse.json({
      code: 'LOGIN_SUCCESS',
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan, credits: user.credits },
    })
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : '未知錯誤' },
      { status: 500 }
    )
  }
}