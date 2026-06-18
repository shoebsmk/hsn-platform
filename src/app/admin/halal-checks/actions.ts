'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) throw new Error('Forbidden')
  return { supabase: createAdminClient(), userId: user.id }
}

export async function reviewHalalCheck(formData: FormData) {
  const { supabase, userId } = await requireAdmin()
  const id = formData.get('id') as string
  const verdict = formData.get('verdict') as string
  const scholar_notes = formData.get('scholar_notes') as string

  await supabase
    .from('halal_checks')
    .update({
      status: 'reviewed',
      verdict,
      scholar_notes: scholar_notes?.trim() || null,
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  revalidatePath('/admin/halal-checks')
  revalidatePath('/halal-check')
}

export async function deleteHalalCheck(id: string) {
  const { supabase } = await requireAdmin()
  await supabase.from('halal_checks').delete().eq('id', id)
  revalidatePath('/admin/halal-checks')
}
