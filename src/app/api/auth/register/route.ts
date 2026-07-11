// Remove BG TW — POST /api/auth/register
import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { createServiceClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Za-z]/).regex(/[0-9]/),
  name: z.string().min(1).max(100),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { code: 'VALIDATION_FAILED', message: '資料驗證失敗', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, password, name } = parsed.data
    const supabase = createServiceClient()

    const passwordHash = await bcrypt.hash(password, 10)
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        name,
        password_hash: passwordHash,
        role: 'user',
        plan: 'free',
        credits: 1, // Free tier: 1 trial
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ code: 'EMAIL_TAKEN', message: 'Email 已被註冊' }, { status: 409 })
      }
      return NextResponse.json({ code: 'CREATE_FAILED', message: error.message }, { status: 500 })
    }

    const cookieStore = await cookies()
    cookieStore.set('rb_session', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600,
      path: '/',
    })

    return NextResponse.json({
      code: 'REGISTER_SUCCESS',
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan, credits: user.credits },
    })
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : '未知錯誤' },
      { status: 500 }
    )
  }
}