'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function submitHalalCheck(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const description = formData.get('description') as string
  const url = formData.get('url') as string || null

  if (!description?.trim()) return { error: 'Please describe the job or paste a link.' }

  const { error } = await supabase.from('halal_checks').insert({
    description: description.trim(),
    url: url?.trim() || null,
    submitter_id: user?.id ?? null,
    status: 'pending',
  })

  if (error) return { error: error.message }

  redirect('/halal-check?submitted=true')
}
