'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'You must be logged in.' }

  const full_name = (formData.get('full_name') as string)?.trim()
  const role = formData.get('role') as string
  const location = formData.get('location') as string
  const bio = (formData.get('bio') as string)?.trim() || null

  if (!full_name) return { error: 'Full name is required.' }
  if (!['seeker', 'provider', 'mentor'].includes(role)) return { error: 'Invalid role selected.' }
  if (!['hyderabad', 'chicago', 'remote'].includes(location)) return { error: 'Invalid location selected.' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name, role, location, bio })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
