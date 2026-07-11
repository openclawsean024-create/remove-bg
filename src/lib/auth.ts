import { createClient } from './supabase/server'

export type Plan = 'free' | 'payg' | 'lite' | 'pro' | 'volume_plus' | 'student' | 'enterprise'

export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: string
  plan: Plan
  credits: number
}

export async function getSession(): Promise<SessionUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('id, email, name, role, plan, credits')
    .eq('id', user.id)
    .single()

  if (!profile) return null
  return profile as SessionUser
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession()
  if (!user) throw new Error('AUTH_REQUIRED')
  return user
}