'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) throw new Error('Forbidden')
  return createAdminClient()
}

export async function updateOpportunityStatus(id: string, status: string) {
  const supabase = await requireAdmin()
  await supabase.from('opportunities').update({ status }).eq('id', id)
  revalidatePath('/admin/opportunities')
  revalidatePath('/opportunities')
}

export async function approveOpportunity(formData: FormData) {
  const supabase = await requireAdmin()
  const id = formData.get('id') as string
  await supabase.from('opportunities').update({ status: 'active' }).eq('id', id)
  revalidatePath('/admin/opportunities')
  revalidatePath('/opportunities')
}

export async function rejectOpportunity(formData: FormData) {
  const supabase = await requireAdmin()
  const id = formData.get('id') as string
  await supabase.from('opportunities').update({ status: 'rejected' }).eq('id', id)
  revalidatePath('/admin/opportunities')
  revalidatePath('/opportunities')
}

export async function flagOpportunity(formData: FormData) {
  const supabase = await requireAdmin()
  const id = formData.get('id') as string
  await supabase.from('opportunities').update({ status: 'flagged' }).eq('id', id)
  revalidatePath('/admin/opportunities')
  revalidatePath('/opportunities')
}

export async function saveArticle(formData: FormData) {
  const supabase = await requireAdmin()
  const { data: { user } } = await supabase.auth.getUser()

  const id = formData.get('id') as string | null
  const payload = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    category: formData.get('category') as string,
    published: formData.get('published') === 'true',
    author_id: user!.id,
  }

  if (id) {
    await supabase.from('guidance_articles').update(payload).eq('id', id)
  } else {
    await supabase.from('guidance_articles').insert(payload)
  }

  revalidatePath('/admin/guidance')
  revalidatePath('/guidance')
}

export async function deleteArticle(id: string) {
  const supabase = await requireAdmin()
  await supabase.from('guidance_articles').delete().eq('id', id)
  revalidatePath('/admin/guidance')
  revalidatePath('/guidance')
}

export async function saveAnnouncement(formData: FormData) {
  const supabase = await requireAdmin()
  const id = formData.get('id') as string | null
  const payload = {
    message: formData.get('message') as string,
    active: formData.get('active') === 'true',
    location_target: formData.get('location_target') as string,
  }

  if (id) {
    await supabase.from('announcements').update(payload).eq('id', id)
  } else {
    await supabase.from('announcements').insert(payload)
  }

  revalidatePath('/admin/announcements')
  revalidatePath('/')
}

export async function deleteAnnouncement(id: string) {
  const supabase = await requireAdmin()
  await supabase.from('announcements').delete().eq('id', id)
  revalidatePath('/admin/announcements')
  revalidatePath('/')
}
