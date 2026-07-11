// Remove BG TW — GET /api/images (history)
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: Request) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ code: 'AUTH_REQUIRED', message: '請先登入' }, { status: 401 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('images')
      .select('id, original_url, result_url, background, format, status, credits_charged, created_at, completed_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ code: 'QUERY_FAILED', message: error.message }, { status: 500 })
    }

    return NextResponse.json({ code: 'OK', images: data })
  } catch (err) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : '未知錯誤' },
      { status: 500 }
    )
  }
}