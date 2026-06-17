'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function submitOpportunity(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'You must be logged in to post an opportunity.' }

  const { error } = await supabase.from('opportunities').insert({
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    location: formData.get('location') as string,
    contact_info: formData.get('contact_info') as string || null,
    external_url: formData.get('external_url') as string || null,
    is_remote: formData.get('is_remote') === 'on',
    provider_id: user.id,
    status: 'active',
  })

  if (error) return { error: error.message }

  redirect('/opportunities/new?submitted=true')
}
